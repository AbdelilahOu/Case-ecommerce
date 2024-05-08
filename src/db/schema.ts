import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const configurations = pgTable("configurations", {
  id: serial("id"),
  width: integer("width"),
  height: integer("height"),
  croppedImageUrl: text("cropped_img_url"),
});
