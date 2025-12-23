import { ResponsiveDialog } from "@/components/blocks/responsive-dialog";
import { createFileRoute } from "@tanstack/react-router";
import { MutateExpenseForm } from "./-components/mutate-expense-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(app)/expenses/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div>
      <ResponsiveDialog
        title="New Expense Record"
        open={openDialog}
        onOpenChange={setOpenDialog}
        triggerComponent={<Button>New Expense</Button>}
      >
        <MutateExpenseForm />
      </ResponsiveDialog>
    </div>
  );
}
