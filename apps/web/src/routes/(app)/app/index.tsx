import { createFileRoute } from "@tanstack/react-router";
import { authMiddleware } from "@/middlewares/auth";
import { useSession } from "@/hooks/use-session";
import { authClient } from "@/lib/auth";

export const Route = createFileRoute("/(app)/app/")({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware],
  },
});

function RouteComponent() {
  const { data } = useSession();

  const onLogout = async () => {
    await authClient.signOut();
  };

  return (
    <div>
      <p>Welcome {data?.user.name}</p>
      <button type="button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
