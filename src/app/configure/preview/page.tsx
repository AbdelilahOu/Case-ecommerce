import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignPreview from "./DesignPreview";
import { configurations } from "@/db/schema";
import { eq } from "drizzle-orm";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function Preview({ searchParams }: PageProps) {
  const { id } = searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  const [configuration] = await db
    .select()
    .from(configurations)
    .where(eq(configurations.id, id));

  if (!configuration) {
    return notFound();
  }

  return <DesignPreview configuration={configuration} />;
}
