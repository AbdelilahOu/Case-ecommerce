CREATE TABLE IF NOT EXISTS "configurations" (
	"id" uuid DEFAULT gen_random_uuid(),
	"width" integer,
	"height" integer,
	"img_url" text,
	"cropped_img_url" text
);
