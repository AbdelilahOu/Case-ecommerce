"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db } from "@/db";
import { OrderT, configurations, orders } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { and, eq } from "drizzle-orm";

export const createCheckoutSession = async ({
  configId,
}: {
  configId: string;
}) => {
  const [configuration] = await db
    .select()
    .from(configurations)
    .where(eq(configurations.id, configId));

  if (!configuration) {
    throw new Error("No such configuration found");
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("you need to be logged in");
  }

  const { finish, material, id, imageUrl } = configuration;

  let totalPrice = BASE_PRICE;
  if (material === "polycarbonate")
    totalPrice += PRODUCT_PRICES.material.polycarbonate;
  if (finish === "textured") totalPrice += PRODUCT_PRICES.finish.textured;

  let order: OrderT | undefined;

  const [existingOrder] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.userId, user.id), eq(orders.configurationId, id)));

  console.log(user.id);

  if (existingOrder?.id) {
    order = existingOrder;
  } else {
    let [newOrder] = await db
      .insert(orders)
      .values({
        amount: totalPrice / 100,
        userId: user.id,
        configurationId: id,
        status: "awaiting_shipment",
      })
      .returning();
    order = newOrder;
  }

  const product = await stripe.products.create({
    name: "Create iPhone case",
    images: [imageUrl],
    default_price_data: {
      currency: "USD",
      unit_amount: totalPrice,
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${id}`,
    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["MA", "US"],
    },
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    line_items: [
      {
        price: product.default_price as string,
        quantity: 1,
      },
    ],
  });

  return {
    url: stripeSession.url,
  };
};
