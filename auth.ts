import crypto from "crypto";
import { cookies } from "next/headers";
const sig=(s:string)=>crypto.createHmac("sha256",process.env.AUTH_SECRET!).update(s).digest("hex");
export const makeToken=()=>{const e=Date.now()+12*3600e3;return `${e}.${sig(String(e))}`};
export async function isAdmin(){
  const t=(await cookies()).get("tg_admin")?.value||"";const [e,s]=t.split(".");
  if(!e||!s||Number(e)<Date.now())return false;
  const a=Buffer.from(sig(e)),b=Buffer.from(s);return a.length===b.length&&crypto.timingSafeEqual(a,b);
}
