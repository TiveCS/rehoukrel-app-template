import { SignUpForm } from "@/components/feats/auth/signup-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <SignUpForm />
    </div>
  );
}
