import { createUploadthing, type FileRouter } from "uploadthing/next";
import sharp from "sharp";
import { z } from "zod";
import { db } from "@/db";
import { configurations } from "@/db/schema";
import { eq } from "drizzle-orm";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(
      z.object({
        configId: z.string().optional(),
      })
    )
    .middleware(async ({ input }) => {
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input;

      const res = await fetch(file.url);
      const buffer = await res.arrayBuffer();
      const imageMetadata = await sharp(buffer).metadata();
      const { width, height } = imageMetadata;

      if (!configId) {
        const [configuration] = await db
          .insert(configurations)
          .values({
            width: width || 500,
            height: height || 500,
            imageUrl: file.url,
          })
          .returning({ insertedId: configurations.id });

        return {
          configId: configuration.insertedId,
        };
      } else {
        const [updatedConfigurations] = await db
          .update(configurations)
          .set({ croppedImageUrl: file.url })
          .where(eq(configurations.id, configId))
          .returning({ updatedId: configurations.id });

        return { configId: updatedConfigurations.updatedId };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
