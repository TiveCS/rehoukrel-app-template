import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";

export type ResponsiveCalendarSelectorProps = {
  title: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  description?: React.ReactNode;
  calendarProps: React.ComponentProps<typeof Calendar>;
  drawerProps?: React.ComponentProps<typeof Drawer>;
  popoverProps?: React.ComponentProps<typeof Popover>;
  children: React.ReactNode;
};

export function ResponsiveCalendarSelector({
  title,
  open,
  onOpenChange,
  description,
  calendarProps,
  drawerProps,
  popoverProps,
  children,
}: ResponsiveCalendarSelectorProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isMobile = useIsMobile();

  open = open ?? internalOpen;
  onOpenChange = onOpenChange ?? setInternalOpen;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} {...drawerProps}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>

        <DrawerContent className="w-auto overflow-hidden p-0">
          {(title || description) && (
            <DrawerHeader className="sr-only">
              {title && <DrawerTitle>{title}</DrawerTitle>}
              {description && (
                <DrawerDescription>{description}</DrawerDescription>
              )}
            </DrawerHeader>
          )}

          <Calendar
            {...calendarProps}
            className={cn(
              "mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),52px)]",
              calendarProps?.className,
            )}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange} {...popoverProps}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent>
        <Calendar {...calendarProps} />
      </PopoverContent>
    </Popover>
  );
}
