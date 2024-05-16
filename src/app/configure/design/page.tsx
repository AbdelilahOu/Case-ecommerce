import { db } from "@/db";
import { configurations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import CaseDesigner from "./CaseDesigner";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const { id } = searchParams;

  if (!id || typeof id !== "string") return notFound();

  const [configuration] = await db
    .select()
    .from(configurations)
    .where(eq(configurations.id, id));

  if (!configuration) return notFound();

  const { width, height, imageUrl } = configuration;

  return (
    <CaseDesigner
      configId={id}
      imageUrl={imageUrl!}
      imageDimensions={{ height: height!, width: width! }}
    />
  );
}
