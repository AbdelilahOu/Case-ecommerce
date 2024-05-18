"use server";

import { db } from "@/db";
import { AVAILABLE_ORDER_STATUS } from "./StatusDropdown";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export const changeOrderStatus = async ({
  id,
  newStatus,
}: {
  id: string;
  newStatus: (typeof AVAILABLE_ORDER_STATUS)[number];
}) => {
  await db
    .update(orders)
    .set({
      status: newStatus,
    })
    .where(eq(orders.id, id));
};
