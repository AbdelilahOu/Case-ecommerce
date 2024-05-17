"use server";

import { db } from "@/db";
import { configurations } from "@/db/schema";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/validator/option-validator";
import { eq } from "drizzle-orm";

export type OrderConfig = {
  color: (typeof COLORS)[number]["value"];
  finish: (typeof FINISHES.options)[number]["value"];
  material: (typeof MATERIALS.options)[number]["value"];
  model: (typeof MODELS.options)[number]["value"];
  configId: string;
};

export async function saveOrderConfig(config: OrderConfig) {
  await db
    .update(configurations)
    .set({
      color: config.color,
      finish: config.finish,
      material: config.material,
      model: config.model,
    })
    .where(eq(configurations.id, config.configId))
    .returning();
}
