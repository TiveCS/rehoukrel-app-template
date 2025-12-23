import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import {
  Link,
  type LinkProps,
  type RegisteredRouter,
} from "@tanstack/react-router";
import {
  ChevronRight,
  FilePenIcon,
  HomeIcon,
  type LucideIcon,
  Plus,
  ReceiptIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export type AppSidebarMenuItem = {
  title: string;
  icon?: LucideIcon;
  badge?: string | number;
  action?: {
    icon: LucideIcon;
    onClick: () => void;
    label?: string;
  };
} & (
  | { childs: AppSidebarMenuItem[]; url?: never }
  | { url: LinkProps<RegisteredRouter>["to"]; childs?: never }
);

const menuItems: AppSidebarMenuItem[] = [
  {
    title: "Home",
    icon: HomeIcon,
    url: "/home",
  },
  {
    title: "Expenses",
    icon: ReceiptIcon,
    url: "/expenses",
  },
  {
    title: "Todo List",
    icon: FilePenIcon,
    url: "/todos",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/home" className="font-semibold">
          <div className="flex items-center justify-center hover:underline">
            TiveHub
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                // Regular menu item with URL
                if ("url" in item && item.url) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link to={item.url}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                      {item.action && (
                        <SidebarMenuAction onClick={item.action.onClick}>
                          <item.action.icon />
                          <span className="sr-only">
                            {item.action.label || "Action"}
                          </span>
                        </SidebarMenuAction>
                      )}
                    </SidebarMenuItem>
                  );
                }

                // Collapsible group with children
                if ("childs" in item) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        {item.action && (
                          <SidebarMenuAction onClick={item.action.onClick}>
                            <item.action.icon />
                            <span className="sr-only">
                              {item.action.label || "Action"}
                            </span>
                          </SidebarMenuAction>
                        )}
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.childs?.map((child) => (
                              <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link to={child.url}>
                                    {child.icon && <child.icon />}
                                    <span>{child.title}</span>
                                    {child.badge && (
                                      <span className="ml-auto text-xs tabular-nums">
                                        {child.badge}
                                      </span>
                                    )}
                                  </Link>
                                </SidebarMenuSubButton>
                                {child.action && (
                                  <SidebarMenuAction
                                    onClick={child.action.onClick}
                                  >
                                    <child.action.icon />
                                    <span className="sr-only">
                                      {child.action.label || "Action"}
                                    </span>
                                  </SidebarMenuAction>
                                )}
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return null;
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
