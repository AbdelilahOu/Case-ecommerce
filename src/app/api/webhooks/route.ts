import { db } from "@/db";
import { orders, shippingAddress, billingAddress } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      throw new Response("invalide signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    if (event.type == "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error("messing user email");
      }

      const session = event.data.object as Stripe.Checkout.Session;

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };

      if (!userId || !orderId) {
        throw new Error("invalid request metadata");
      }

      const stripeBillingAddress = session.customer_details!.address;
      const stripeShippingAddress = session.shipping_details!.address;

      const [[{ shippingId }], [{ billingId }]] = await Promise.all([
        db
          .insert(shippingAddress)
          .values({
            name: session.customer_details!.name!,
            city: stripeShippingAddress!.city!,
            country: stripeShippingAddress!.country!,
            postalCode: stripeShippingAddress!.postal_code!,
            street: stripeShippingAddress!.line1!,
            state: stripeShippingAddress!.state!,
          })
          .returning({ shippingId: shippingAddress.id }),
        db
          .insert(billingAddress)
          .values({
            name: session.customer_details!.name!,
            city: stripeBillingAddress!.city!,
            country: stripeBillingAddress!.country!,
            postalCode: stripeBillingAddress!.postal_code!,
            street: stripeBillingAddress!.line1!,
            state: stripeBillingAddress!.state!,
          })
          .returning({ billingId: billingAddress.id }),
        ,
      ]);

      if (!shippingId || !billingId) {
        throw new Error("coudnt create billing and shipping records");
      }

      await db.update(orders).set({
        isPaid: true,
        shippingAddressId: shippingId,
        billingAddressId: billingId,
      });
    }
    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ result: error, ok: false }, { status: 500 });
  }
}
