"use server";

import { db } from "@/db";
import {
  billingAddress,
  configurations,
  orders,
  shippingAddress,
  users,
} from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { and, eq } from "drizzle-orm";

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id || !user.email) {
    throw new Error("You need to be logged in to view this page.");
  }

  const [result] = await db
    .select()
    .from(orders)
    .leftJoin(billingAddress, eq(orders.billingAddressId, billingAddress.id))
    .leftJoin(shippingAddress, eq(orders.shippingAddressId, shippingAddress.id))
    .leftJoin(configurations, eq(orders.configurationId, configurations.id))
    .leftJoin(users, eq(orders.userId, users.id))
    .where(and(eq(orders.id, orderId), eq(users.id, user.id)));

  if (!result.orders) throw new Error("This order does not exist.");

  if (result.orders.isPaid) {
    return result;
  } else {
    return false;
  }
};
