import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {
    VITE_API_URL: z.string().url().default("http://localhost:8080"),
  },
  clientPrefix: "VITE_",
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
