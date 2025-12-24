import { ResponsiveDialog } from "@/components/blocks/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useDeleteExpense } from "../../-queries/use-delete-expense";

export type DeleteExpenseDialogProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerComponent: React.ReactNode;
  onDeleted?: () => void;
};

export function DeleteExpenseDialog({
  id,
  open,
  onOpenChange,
  triggerComponent,
  onDeleted,
}: DeleteExpenseDialogProps) {
  const deleteMutation = useDeleteExpense();

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Expense deleted successfully");
        onOpenChange(false);
        onDeleted?.();
      },
      onError: (error) => {
        toast.error("Failed to delete expense", {
          description: error.message,
        });
      },
    });
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      triggerComponent={triggerComponent}
      title="Delete Expense"
      description="Are you sure you want to delete this expense? This action cannot be undone."
    >
      <div className="flex flex-col gap-4 px-4 pb-4">
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && <Spinner className="mr-2" />}
            Delete
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
