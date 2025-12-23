import { redirect, useNavigate } from "@tanstack/react-router";
import { ComponentProps, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function LogoutButton({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    setLoading(true);

    await authClient.signOut({
      fetchOptions: {
        onError: ({ error }) => {
          setLoading(false);
          toast.error(error.message);
          throw redirect({ to: "/signin" });
        },
        onSuccess: () => {
          toast.success("Logged out successfully");
          navigate({ to: "/signin" });
        },
      },
    });
  };

  return (
    <Button
      onClick={onLogout}
      type="button"
      disabled={loading}
      variant="destructive"
      className={cn("cursor-pointer disabled:cursor-not-allowed", className)}
      {...props}
    >
      {loading && <Spinner className="mr-2.5" />}
      Logout
    </Button>
  );
}
