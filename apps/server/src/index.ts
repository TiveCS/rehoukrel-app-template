import cors from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import {
  isFailureResult,
  isSuccessResult,
  toFailureResponseStruct,
  validationError,
} from "@tivecs/core";
import { Elysia, status } from "elysia";
import z from "zod/v4";
import { env } from "../env";
import { OpenAPI } from "./internal/auth";
import { betterAuthSetup } from "./internal/auth/auth.setup";
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
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
    }),
  )
  .onError(({ code, error }) => {
    if (code === "VALIDATION") {
      const fieldErrors: Record<string, string[]> = {};

      error.all.forEach((err) => {
        if ("path" in err) {
          const currentErrors = fieldErrors[err.path] || [];

          currentErrors.push(err.message);
          fieldErrors[err.path] = currentErrors;
        }
      });

      const validationErr = validationError(fieldErrors);
      const { statusCode } = validationErr;

      return status(statusCode, toFailureResponseStruct(validationErr));
    }
  })
  .onAfterHandle(({ responseValue, status }) => {
    if (isFailureResult(responseValue)) {
      return status(
        responseValue.statusCode,
        toFailureResponseStruct(responseValue),
      );
    }

    if (isSuccessResult(responseValue)) {
      return "data" in responseValue ? responseValue.data : undefined;
    }
  })
  .use(expensesRoute)
  .listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.protocol}://${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
