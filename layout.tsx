import "./globals.css";import Link from "next/link";import CartLink from "@/components/CartLink";
export const metadata={title:"THINKGEARS Electronics",description:"Powering Ideas. Engineering the Future."};
export default function Root({children}:{children:React.ReactNode}){return <html lang="en"><body>
<header><div className="hd"><Link href="/" className="logo">⚙ THINKGEARS<small>ELECTRONICS</small></Link>
<form action="/shop"><input name="q" placeholder="Search products, SKU, brand…"/><button>Search</button></form>
<Link href="/shop">Shop</Link><CartLink/></div></header>{children}
<footer>THINKGEARS Electronics — Powering Ideas. Engineering the Future.<br/>Address / phone / WhatsApp / email: [PLACEHOLDER — edit in app/layout.tsx]<br/>Shipping &amp; returns policy: [to be configured]</footer></body></html>}
