import { ResponsiveDialog } from "@/components/blocks/responsive-dialog";
import { Button } from "@/components/ui/button";
import { ExpenseCategory } from "@/server/modules/finance/models";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";
import { useGetExpenses } from "../-queries/use-get-expenses";
import {
  ExpenseColumnModel,
  ListExpensesTable,
} from "./-components/list-expenses-table";
import { MutateExpenseForm } from "./-components/mutate-expense-form";

export const Route = createFileRoute("/(app)/expenses/")({
  component: ExpensesPages,
  validateSearch: z.object({
    page: z.int().positive().default(1).catch(1),
    search: z.string().optional(),
    category: z.enum(ExpenseCategory).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

function ExpensesPages() {
  const { page, search, category, startDate, endDate } = useSearch({
    from: "/(app)/expenses/",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const getExpenses = useGetExpenses({
    page,
    search,
    category,
    startDate,
    endDate,
  });

  const expenses: ExpenseColumnModel[] =
    getExpenses.data?.items.map((expense) => ({
      id: expense.id,
      occurredAt: new Date(expense.occurredAt),
      amount: expense.amount,
      note: expense.note,
      category: expense.category,
    })) || [];

  const paginationData = getExpenses.data
    ? {
        currentPage: getExpenses.data.page,
        totalPages: getExpenses.data.totalPages,
        totalCount: getExpenses.data.totalItems,
        pageSize: getExpenses.data.pageSize,
      }
    : undefined;

  return (
    <div className="flex flex-col flex-1 pl-6 pr-8">
      <div className="mb-8">
        <ResponsiveDialog
          title="New Expense Record"
          open={openDialog}
          onOpenChange={setOpenDialog}
          triggerComponent={<Button>New Expense</Button>}
        >
          <MutateExpenseForm onSuccess={() => setOpenDialog(false)} />
        </ResponsiveDialog>
      </div>

      <ListExpensesTable
        expenses={expenses}
        isLoading={getExpenses.isLoading}
        category={category}
        startDate={startDate ? new Date(startDate) : undefined}
        endDate={endDate ? new Date(endDate) : undefined}
        paginationData={paginationData}
      />
    </div>
  );
}
