import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Unicorn OS Pro" },
          unit_amount: 1200,
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/settings?tab=billing&success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/settings?tab=billing&canceled=true`,
  });

  return Response.json({ url: session.url });
}
