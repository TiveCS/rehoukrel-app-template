import type { ComponentProps } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

export type ResponsiveDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerComponent: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  drawerClose?: React.ReactNode;
  dialogProps?: ComponentProps<typeof Dialog>;
  dialogTriggerProps?: ComponentProps<typeof DialogTrigger>;
  dialogContentProps?: ComponentProps<typeof DialogContent>;
  drawerProps?: ComponentProps<typeof Drawer>;
  drawerTriggerProps?: ComponentProps<typeof DrawerTrigger>;
  drawerContentProps?: ComponentProps<typeof DrawerContent>;
};

export function ResponsiveDialog({
  children,
  description,
  title,
  onOpenChange,
  open,
  triggerComponent,
  drawerClose,
  dialogProps,
  dialogTriggerProps,
  dialogContentProps,
  drawerProps,
  drawerTriggerProps,
  drawerContentProps,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} {...dialogProps}>
        <DialogTrigger asChild {...dialogTriggerProps}>
          {triggerComponent}
        </DialogTrigger>
        <DialogContent {...dialogContentProps}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} {...drawerProps}>
      <DrawerTrigger asChild {...drawerTriggerProps}>
        {triggerComponent}
      </DrawerTrigger>
      <DrawerContent {...drawerContentProps}>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>

        {children}

        <DrawerFooter className="pt-4 pb-8">
          <DrawerClose asChild>
            {drawerClose ? (
              drawerClose
            ) : (
              <Button variant="outline">Cancel</Button>
            )}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
