import { treaty } from "@elysiajs/eden";
import type { App } from "server";

const app = treaty<App>("http://localhost:8080");

export async function hello() {
  return await app.get();
}
