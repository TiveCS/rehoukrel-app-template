import Elysia from "elysia";
import { auth } from ".";
import { AuthErrors, failure, toFailureResponseStruct } from "@tivecs/core";

export const authMacro = new Elysia().macro({
  auth: {
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({
        headers,
      });

      if (!session)
        return status(
          401,
          toFailureResponseStruct(failure(AuthErrors.Unauthorized)),
        );

      return {
        user: session.user,
        session: session.session,
      };
    },
  },
});

export const betterAuthSetup = new Elysia().mount(auth.handler).use(authMacro);
