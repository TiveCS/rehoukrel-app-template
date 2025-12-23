import { useSession } from "@/hooks/use-session";
import { authClient } from "@/lib/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOutIcon, Settings, UserRoundIcon } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function UserAvatarMenu() {
  const navigation = useNavigate();
  const { data, isPending, isRefetching } = useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(`Error signing out: ${error.message}`);
        },
        onSuccess: () => {
          navigation({ to: "/signin" });
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-row items-center gap-x-4 cursor-pointer group">
          <div className="flex flex-col items-end">
            {isPending || isRefetching ? (
              <p className="font-medium text-sm">Loading...</p>
            ) : (
              <p className="font-medium text-sm">{data?.user.name}</p>
            )}
          </div>

          <Avatar className="size-10">
            <AvatarImage
              src={data?.user.image || undefined}
              alt={data?.user.name}
            />
            <AvatarFallback>
              <UserRoundIcon className="size-5 text-gray-500" />
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 ">
        <DropdownMenuItem asChild>
          <Link to="/accounts">
            <UserRoundIcon />
            Accounts
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/accounts">
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
