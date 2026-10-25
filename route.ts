import { randomUUID } from "crypto";
import { pool } from "@/lib/db";
import { initialize } from "@/lib/paystack";
const bad = (m: string, s = 400) => Response.json({ error: m }, { status: s });

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  const items = b?.items, cu = b?.customer;
  if (!Array.isArray(items) || !items.length || items.length > 50 || !cu) return bad("Invalid request");
  if (!/^\S+@\S+\.\S+$/.test(cu.email || "") || !cu.name || !cu.phone || !cu.address || !cu.state || !cu.city) return bad("Missing customer details");
  const qty = new Map<string, number>();
  for (const i of items) {
    const n = Number(i.qty);
    if (!i.sku || !Number.isInteger(n) || n < 1 || n > 100) return bad("Invalid item");
    qty.set(i.sku, (qty.get(i.sku) || 0) + n);
  }
  const ref = "TG-" + randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase();
  const c = await pool.connect();
  let total = 0;
  try {
    await c.query("BEGIN");
    // Prices always come from the database, never from the browser.
    const rows = (await c.query("SELECT id,sku,price_kobo,stock FROM products WHERE sku=ANY($1) AND active FOR UPDATE", [[...qty.keys()]])).rows;
    if (rows.length !== qty.size) { await c.query("ROLLBACK"); return bad("A product is unavailable"); }
    let sub = 0;
    for (const r of rows) {
      if (r.stock < qty.get(r.sku)!) { await c.query("ROLLBACK"); return bad(`Not enough stock for ${r.sku}`); }
      sub += r.price_kobo * qty.get(r.sku)!;
    }
    const ship = Number(process.env.SHIPPING_FLAT_KOBO || 0);
    total = sub + ship;
    const o = (await c.query(
      "INSERT INTO orders(reference,email,name,phone,address,state,city,subtotal_kobo,shipping_kobo,total_kobo) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id",
      [ref, cu.email, cu.name, cu.phone, cu.address, cu.state, cu.city, sub, ship, total])).rows[0];
    for (const r of rows) await c.query("INSERT INTO order_items(order_id,product_id,qty,unit_price_kobo) VALUES($1,$2,$3,$4)", [o.id, r.id, qty.get(r.sku), r.price_kobo]);
    await c.query("COMMIT");
  } catch (e) { await c.query("ROLLBACK"); console.error(e); return bad("Server error", 500); } finally { c.release(); }
  try {
    return Response.json({ url: await initialize(cu.email, total, ref), reference: ref });
  } catch (e) {
    await pool.query("UPDATE orders SET status='cancelled' WHERE reference=$1", [ref]);
    return bad("Could not start payment", 502);
  }
}
