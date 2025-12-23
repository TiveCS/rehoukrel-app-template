import { authClient } from "@/lib/auth";
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const publicOnlyMiddleware = createMiddleware().server(
  async ({ next }) => {
    const headers = getRequestHeaders();
    const session = await authClient.getSession({ fetchOptions: { headers } });

    if (session.data) throw redirect({ to: "/home" });

    return await next();
  },
);
