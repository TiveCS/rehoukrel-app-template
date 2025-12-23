import { LogoutButton } from "@/components/feats/auth/logout-button";
import { useSession } from "@/hooks/use-session";
import { authMiddleware } from "@/middlewares/auth";
import { createFileRoute } from "@tanstack/react-router";

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
