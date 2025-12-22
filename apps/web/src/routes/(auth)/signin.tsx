import { LoginForm } from "@/components/feats/auth/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <LoginForm />
    </div>
  );
}
