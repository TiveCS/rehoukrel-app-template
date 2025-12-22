import openapi from "@elysiajs/openapi";
import Elysia from "elysia";
import { OpenAPI } from "../auth";
import z from "zod";

export const openapiSetup = new Elysia().use(
  openapi({
    documentation: {
      components: await OpenAPI.components,
      paths: await OpenAPI.getPaths(),
    },
    mapJsonSchema: {
      zod: z.toJSONSchema,
    },
  }),
);
