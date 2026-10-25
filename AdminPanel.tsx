"use client";
import {useState} from "react";import {CATS} from "@/lib/cats";
const E={sku:"",name:"",brand:"",category:CATS[0],description:"",specs:"",price:"",stock:"",image:""};
const ST=["pending","paid","review","processing","shipped","delivered","cancelled","refunded"];
export function AdminLogin(){const [e,setE]=useState("");return <main className="w" style={{maxWidth:380}}><h1>Admin login</h1>
<form onSubmit={async ev=>{ev.preventDefault();const r=await fetch("/api/admin/login",{method:"POST",body:JSON.stringify({password:(ev.currentTarget as any).pw.value})});r.ok?location.reload():setE("Wrong password")}}>
<input className="f" name="pw" type="password" placeholder="Password"/><p style={{color:"#c0392b"}}>{e}</p><button className="btn">Log in</button></form></main>}
function shrink(f:File):Promise<string>{return new Promise(res=>{const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const k=Math.min(1,900/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=i.width*k;c.height=i.height*k;c.getContext("2d")!.drawImage(i,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",.82))};i.src=r.result as string};r.readAsDataURL(f)})}
export function AdminPanel({products,orders}:{products:any[];orders:any[]}){
  const [f,setF]=useState<any>(E),[m,setM]=useState(""),set=(k:string,v:string)=>setF({...f,[k]:v});
  const api=async(url:string,method:string,body:any)=>{const r=await fetch(url,{method,body:JSON.stringify(body)});const j=await r.json();if(r.ok)location.reload();else setM(j.error)};
  return <main className="w"><h1>Admin dashboard <button className="btn s" onClick={async()=>{await fetch("/api/admin/login",{method:"DELETE"});location.reload()}}>Log out</button></h1>
  <h2>{f.sku&&products.some(p=>p.sku==f.sku)?"Edit product":"Add product"}</h2>
  <form onSubmit={e=>{e.preventDefault();api("/api/admin/products","POST",f)}} style={{display:"grid",gap:8}}>
   <div className="fg"><input className="f" placeholder="SKU" value={f.sku} onChange={e=>set("sku",e.target.value)} required/><input className="f" placeholder="Product name" value={f.name} onChange={e=>set("name",e.target.value)} required/>
   <input className="f" placeholder="Brand" value={f.brand} onChange={e=>set("brand",e.target.value)}/><select value={f.category} onChange={e=>set("category",e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
   <input className="f" type="number" step="0.01" placeholder="Price (₦)" value={f.price} onChange={e=>set("price",e.target.value)} required/><input className="f" type="number" placeholder="Stock" value={f.stock} onChange={e=>set("stock",e.target.value)} required/></div>
   <textarea rows={2} placeholder="Description" value={f.description} onChange={e=>set("description",e.target.value)}/>
   <textarea rows={4} placeholder={"Specifications, one per line:\nOperating voltage: 3.3 V"} value={f.specs} onChange={e=>set("specs",e.target.value)}/>
   <input type="file" accept="image/*" onChange={async e=>{const x=e.target.files?.[0];if(x)set("image",await shrink(x))}}/>{f.image&&<img src={f.image} alt="" style={{maxWidth:180,borderRadius:8}}/>}
   <p style={{color:"#c0392b"}}>{m}</p><div><button className="btn">Save product</button> <button type="button" className="btn s" onClick={()=>setF(E)}>Clear</button></div></form>
  <h2>Products ({products.length})</h2>{products.map(p=><div className="row" key={p.sku}><span>{p.name}<br/><small>{p.sku} · ₦{p.price_kobo/100} · stock {p.stock}{p.is_sample?" · SAMPLE":""}</small></span>
   <span><button className="btn s" onClick={()=>{setF({sku:p.sku,name:p.name,brand:p.brand||"",category:p.category||CATS[0],description:p.description||"",specs:p.specs||"",price:p.price_kobo/100,stock:p.stock,image:""});scrollTo(0,0)}}>Edit</button> <button className="btn" style={{background:"#c0392b"}} onClick={()=>confirm("Hide this product from the store?")&&api("/api/admin/products","DELETE",{sku:p.sku})}>Remove</button></span></div>)}
  <h2>Orders ({orders.length})</h2>{orders.map(o=><div className="row" key={o.reference}><span><b>{o.reference}</b> · ₦{o.total_kobo/100}<br/><small>{o.name}, {o.phone}, {o.address}, {o.city}, {o.state}<br/>{o.items}</small></span>
   <select value={o.status} style={{width:"auto"}} onChange={e=>api("/api/admin/orders","PATCH",{reference:o.reference,status:e.target.value})}>{ST.map(s=><option key={s}>{s}</option>)}</select></div>)}</main>}
