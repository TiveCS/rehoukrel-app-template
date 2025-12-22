import {
  AuthErrors,
  failure,
  failureResultResponseSchema,
  HttpStatus,
  toFailureResponseStruct,
} from "@tivecs/core";
import Elysia from "elysia";
import z from "zod";
import { auth } from "../auth";

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
    response: {
      [HttpStatus.Unauthorized]: failureResultResponseSchema
        .extend({
          code: z.literal(AuthErrors.Unauthorized.code),
          description: z.literal(AuthErrors.Unauthorized.description),
        })
        .omit({ fieldErrors: true }),
      [HttpStatus.Forbidden]: failureResultResponseSchema
        .extend({
          code: z.literal(AuthErrors.Forbidden.code),
          description: z.literal(AuthErrors.Forbidden.description),
        })
        .omit({ fieldErrors: true }),
    },
  },
});

export const betterAuthSetup = new Elysia().mount(auth.handler).use(authMacro);
