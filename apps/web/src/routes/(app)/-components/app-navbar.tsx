import { UserAvatarMenu } from "@/components/blocks/user-avatar-menu";

export function AppNavbar() {
  return (
    <nav className="px-8 py-4 flex flex-row items-center justify-end-safe w-full">
      <UserAvatarMenu />
    </nav>
  );
}
