import { createAuthClient } from "better-auth/react";
import { env } from "env";

export const { useSession } = createAuthClient({
  baseURL: env.VITE_API_URL,
  basePath: "/api/auth",
});
