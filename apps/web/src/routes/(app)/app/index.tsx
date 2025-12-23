import { createFileRoute } from "@tanstack/react-router";
import { authMiddleware } from "@/middlewares/auth";
import { useSession } from "@/hooks/use-session";
import { authClient } from "@/lib/auth";
import { LogoutButton } from "@/components/feats/auth/logout-button";

export const Route = createFileRoute("/(app)/app/")({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware],
  },
});

function RouteComponent() {
  const { data } = useSession();

  return (
    <div>
      <p>Welcome {data?.user.name}</p>

      <LogoutButton />
    </div>
  );
}
