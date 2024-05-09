import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const configurations = pgTable("configurations", {
  id: uuid("id").defaultRandom(),
  width: integer("width"),
  height: integer("height"),
  imageUrl: text("img_url"),
  croppedImageUrl: text("cropped_img_url"),
});
