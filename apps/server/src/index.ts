import {
  isFailureResult,
  isSuccessResult,
  toFailureResponseStruct,
  validationError,
} from "@tivecs/core";
import { Elysia, status } from "elysia";
import { env } from "../env";
import { betterAuthSetup, corsSetup, openapiSetup } from "./internal/setups";
import { expensesRoute } from "./modules/finance/routes";
import { testRoute } from "./modules/finance/routes/test.route";

const app = new Elysia()
  .use(corsSetup)
  .use(betterAuthSetup)
  .use(openapiSetup)
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
  .group("/api", (app) => app.use(testRoute).use(expensesRoute))
  .listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.protocol}://${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
