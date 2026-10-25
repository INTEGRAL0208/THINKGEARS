import Link from "next/link";import AddToCart from "./AddToCart";import {N} from "@/lib/fmt";
export default function Card({p}:{p:any}){return <div className="card">
  <Link href={`/product/${p.sku}`}>{p.has_image?<img src={`/api/img/${p.sku}`} alt={p.name}/>:<div className="ph">THINKGEARS</div>}</Link>
  <div className="b">{p.is_sample&&<span className="tag">SAMPLE DATA</span>}<small>{p.brand} · {p.sku}</small>
  <Link href={`/product/${p.sku}`}><b>{p.name}</b></Link><div className="pr">{N(p.price_kobo)}</div>
  <div className={p.stock?"st":"st x"}>{p.stock?"In stock":"Out of stock"}</div>
  <AddToCart sku={p.sku} name={p.name} price={p.price_kobo} stock={p.stock}/></div></div>}
