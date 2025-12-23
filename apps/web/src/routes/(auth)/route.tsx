import { publicOnlyMiddleware } from "@/middlewares/public-only";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  component: AuthLayout,
  server: {
    middleware: [publicOnlyMiddleware],
  },
});

function AuthLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
