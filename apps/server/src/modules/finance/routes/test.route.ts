import { authMacro } from "@/internal/setups";
import Elysia from "elysia";

export const testRoute = new Elysia({
  prefix: "/test",
})
  .use(authMacro)
  .get("/", () => {});
