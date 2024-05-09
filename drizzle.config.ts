import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_URL!,
  },
  out: "./src/drizzle",
  verbose: true,
  strict: true,
});
