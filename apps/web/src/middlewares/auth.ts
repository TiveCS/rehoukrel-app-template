import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { authClient } from "@/lib/auth";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const headers = getRequestHeaders();
  const session = await authClient.getSession({ fetchOptions: { headers } });

  if (!session.data)
    throw redirect({
      to: "/signin",
      search: {
        redirectTo:
          typeof window === "undefined" ? undefined : window.location.href,
      },
    });

  return await next();
});
