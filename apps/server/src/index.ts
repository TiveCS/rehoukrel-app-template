import cors from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { env } from "../env";
import { betterAuthSetup, OpenAPI } from "./internal/auth";
import { expensesRoute } from "./modules/finance/routes";

const app = new Elysia()
  .use(
    cors({
      origin: env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(betterAuthSetup)
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    }),
  )
  .use(expensesRoute)
  .listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.protocol}://${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
