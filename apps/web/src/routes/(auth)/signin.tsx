import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "./-components/login-form";

export const Route = createFileRoute("/(auth)/signin")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <LoginForm />
    </div>
  );
}
