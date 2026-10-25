"use client";
export default function AddToCart(p:{sku:string;name:string;price:number;stock:number}){
  const add=()=>{const c=JSON.parse(localStorage.getItem("tg_cart")||"[]");const x=c.find((y:any)=>y.sku==p.sku);
    if(x)x.qty=Math.min(x.qty+1,p.stock);else c.push({sku:p.sku,name:p.name,price:p.price,qty:1});
    localStorage.setItem("tg_cart",JSON.stringify(c));window.dispatchEvent(new Event("cart"))};
  return <button className="btn" disabled={!p.stock} onClick={add}>{p.stock?"Add to Cart":"Out of stock"}</button>;
}
