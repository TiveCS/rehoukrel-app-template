import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {
    VITE_API_URL: z.url().default("http://localhost:8080"),
    VITE_NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  server: {
    PORT: z.coerce.number().default(3000),
  },
  clientPrefix: "VITE_",
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
