import { defineConfig } from "drizzle-kit";
import { env } from "./env";

export default defineConfig({
  dialect: "postgresql",
  casing: "snake_case",
  schema: "./src/infra/data/schemas",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
