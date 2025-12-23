import { SidebarProvider } from "@/components/ui/sidebar";
import { authMiddleware } from "@/middlewares/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "./-components/app-sidebar";
import { AppNavbar } from "./-components/app-navbar";

export const Route = createFileRoute("/(app)")({
  component: AppLayout,
  server: {
    middleware: [authMiddleware],
  },
});

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex flex-col w-full">
        <AppNavbar />

        <Outlet />
      </div>
    </SidebarProvider>
  );
}
