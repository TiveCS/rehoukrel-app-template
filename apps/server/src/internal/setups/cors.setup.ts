import cors from "@elysiajs/cors";
import Elysia from "elysia";
import { env } from "@/env";

export const corsSetup = new Elysia().use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
