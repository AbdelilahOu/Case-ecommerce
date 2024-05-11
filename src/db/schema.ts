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

const orderStatusEnum = pgEnum("order_status_enum", [
  "fulfilled",
  "shipped",
  "awaiting_shipment",
]);

const phoneModelEnum = pgEnum("phone_model_enum", [
  "iphonex",
  "iphone11",
  "iphone12",
  "iphone13",
  "iphone14",
  "iphone15",
]);

const caseMaterialEnum = pgEnum("case_material_enum", [
  "silicone",
  "polycarbonate",
]);

const caseFinishEnum = pgEnum("case_finish_enum", ["smooth", "textured"]);

const caseColorEnum = pgEnum("case_color_enum", ["black", "blue", "rose"]);

export const configurations = pgTable("configurations", {
  id: uuid("id").defaultRandom(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  imageUrl: text("img_url").notNull(),
  color: caseColorEnum("case_color_enum"),
  finish: caseFinishEnum("case_finish_enum"),
  material: caseMaterialEnum("case_material_enum"),
  model: phoneModelEnum("phone_model_enum"),
  croppedImageUrl: text("cropped_img_url"),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ShippingAddress = pgTable("shipping_address", {
  id: uuid("id").defaultRandom(),
  name: text("name"),
  street: text("street"),
  city: text("city"),
  postalCode: text("postal_code"),
  country: text("country"),
  state: text("state"),
  phoneNumber: text("phone_number"),
});

export const BillingAddress = pgTable("billing_address", {
  id: uuid("id").defaultRandom(),
  name: text("name"),
  street: text("street"),
  city: text("city"),
  postalCode: text("postal_code"),
  country: text("country"),
  state: text("state"),
  phoneNumber: text("phone_number"),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom(),
  configurationId: uuid("configuration_id").references(() => configurations.id),
  userId: uuid("uder_id").references(() => users.id),
  amount: real("amount"),
  isPaid: boolean("is_paid").default(false),
  status: orderStatusEnum("order_status_enum"),
  shippingAddressId: uuid("shipping_address_id").references(
    () => ShippingAddress.id
  ),
  billingAddress: uuid("billing_address_id").references(
    () => BillingAddress.id
  ),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
