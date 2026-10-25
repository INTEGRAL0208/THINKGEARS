import { pool } from "./db";
const H = () => ({ Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" });

export async function initialize(email: string, amountKobo: number, reference: string) {
  const r = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST", headers: H(),
    body: JSON.stringify({ email, amount: amountKobo, currency: "NGN", reference, callback_url: `${process.env.SITE_URL}/order/${reference}` }),
  });
  const j = await r.json();
  if (!r.ok || !j.status) throw new Error(j.message || "Paystack initialize failed");
  return j.data.authorization_url as string;
}

// Idempotent: safe to call from both the webhook and the callback page.
export async function markPaid(reference: string): Promise<string | null> {
  const v = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: H(), cache: "no-store" }).then(r => r.json());
  const c = await pool.connect();
  try {
    await c.query("BEGIN");
    const o = (await c.query("SELECT * FROM orders WHERE reference=$1 FOR UPDATE", [reference])).rows[0];
    if (!o) { await c.query("ROLLBACK"); return null; }
    if (o.status !== "pending") { await c.query("ROLLBACK"); return o.status; }
    const good = v.status && v.data?.status === "success" && v.data.amount === o.total_kobo && v.data.currency === "NGN";
    if (!good) { await c.query("ROLLBACK"); return "pending"; }
    const items = (await c.query("SELECT product_id, qty FROM order_items WHERE order_id=$1", [o.id])).rows;
    await c.query("SAVEPOINT s");
    let ok = true;
    for (const i of items) {
      const u = await c.query("UPDATE products SET stock=stock-$1 WHERE id=$2 AND stock>=$1", [i.qty, i.product_id]);
      if (!u.rowCount) { ok = false; break; }
    }
    if (!ok) await c.query("ROLLBACK TO s");
    const status = ok ? "paid" : "review"; // review = paid but stock short: refund or restock manually
    await c.query("INSERT INTO payments(reference,order_id,amount_kobo,raw,paid_at) VALUES($1,$2,$3,$4,now()) ON CONFLICT DO NOTHING", [reference, o.id, v.data.amount, v]);
    await c.query("UPDATE orders SET status=$1 WHERE id=$2", [status, o.id]);
    await c.query("COMMIT");
    return status;
  } catch (e) { await c.query("ROLLBACK"); throw e; } finally { c.release(); }
}
