import {
  integer,
  pgTable,
  text,
  uuid,
  pgEnum,
  timestamp,
  real,
  boolean,
} from "drizzle-orm/pg-core";
import { relations, type InferSelectModel } from "drizzle-orm";

export const orderStatusEnum = pgEnum("status", [
  "fulfilled",
  "shipped",
  "awaiting_shipment",
]);

export const phoneModelEnum = pgEnum("model", [
  "iphonex",
  "iphone11",
  "iphone12",
  "iphone13",
  "iphone14",
  "iphone15",
]);

export const caseMaterialEnum = pgEnum("material", [
  "silicone",
  "polycarbonate",
]);

export const caseFinishEnum = pgEnum("finish", ["smooth", "textured"]);

export const caseColorEnum = pgEnum("color", ["black", "blue", "rose"]);

export const configurations = pgTable("configurations", {
  id: uuid("id").defaultRandom().primaryKey(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  imageUrl: text("img_url").notNull(),
  color: caseColorEnum("color"),
  finish: caseFinishEnum("finish"),
  material: caseMaterialEnum("material"),
  model: phoneModelEnum("model"),
  croppedImageUrl: text("cropped_img_url"),
});

export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const shippingAddress = pgTable("shipping_address", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  street: text("street"),
  city: text("city"),
  postalCode: text("postal_code"),
  country: text("country"),
  state: text("state"),
  phoneNumber: text("phone_number"),
});

export const billingAddress = pgTable("billing_address", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  street: text("street"),
  city: text("city"),
  postalCode: text("postal_code"),
  country: text("country"),
  state: text("state"),
  phoneNumber: text("phone_number"),
});

export const configurationsRelations = relations(configurations, ({ one }) => ({
  orders: one(orders),
}));

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const shippingAddressRelations = relations(
  shippingAddress,
  ({ many }) => ({
    orders: many(orders),
  })
);

export const BillingAddressRelations = relations(
  billingAddress,
  ({ many }) => ({
    orders: many(orders),
  })
);

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  configurationId: uuid("configuration_id").references(() => configurations.id),
  userId: text("user_id").references(() => users.id),
  amount: real("amount"),
  isPaid: boolean("is_paid").default(false),
  status: orderStatusEnum("status"),
  shippingAddressId: uuid("shipping_address_id").references(
    () => shippingAddress.id
  ),
  billingAddressId: uuid("billing_address_id").references(
    () => billingAddress.id
  ),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  billingAddress: one(billingAddress, {
    fields: [orders.billingAddressId],
    references: [billingAddress.id],
  }),
  shippingAddress: one(shippingAddress, {
    fields: [orders.shippingAddressId],
    references: [shippingAddress.id],
  }),
}));

export type ConfigurationT = InferSelectModel<typeof configurations>;
export type OrderT = InferSelectModel<typeof orders>;
export type ShippingT = InferSelectModel<typeof shippingAddress>;
