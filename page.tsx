import { markPaid } from "@/lib/paystack";
export const dynamic = "force-dynamic";
const M: Record<string, string> = {
  paid: "Payment confirmed. Thank you!",
  pending: "Payment not confirmed yet. If you have paid, refresh in a minute.",
  review: "Payment received but stock needs checking. We will contact you.",
  cancelled: "This order was cancelled.",
};
export default async function Page({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const s = await markPaid(reference);
  return <main style={{ maxWidth: 480, margin: "60px auto", padding: 16 }}><h1>Order {reference}</h1><p>{s ? (M[s] ?? s) : "Order not found."}</p></main>;
}
