"use client";
import Link from "next/link";import {useEffect,useState} from "react";
export default function CartLink({clear}:{clear?:boolean}){
  const [n,setN]=useState(0);
  useEffect(()=>{if(clear)localStorage.removeItem("tg_cart");
    const f=()=>setN(JSON.parse(localStorage.getItem("tg_cart")||"[]").reduce((a:number,i:any)=>a+i.qty,0));
    f();addEventListener("cart",f);return()=>removeEventListener("cart",f)},[clear]);
  return <Link href="/cart">Cart ({n})</Link>;
}
