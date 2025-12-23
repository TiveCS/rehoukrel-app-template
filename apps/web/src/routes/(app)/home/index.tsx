import { LogoutButton } from "@/components/feats/auth/logout-button";
import { useSession } from "@/hooks/use-session";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/home/")({
  component: HomePage,
});

function HomePage() {
  const { data } = useSession();

  return (
    <main className="flex flex-col flex-1 px-8 py-2">
      <p>Hello {data?.user.name}</p>
      <LogoutButton />
    </main>
  );
}
