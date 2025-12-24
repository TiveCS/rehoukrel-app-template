import { ResponsiveCalendarSelector } from "@/components/blocks/responsive-calendar-selector";
import { SimplePagination } from "@/components/blocks/simple-pagination";
import { ExpenseCategoryBadge } from "@/components/feats/expenses/expense-category-badge";
import { ExpenseCategorySelector } from "@/components/feats/expenses/expense-category-selector";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseCategory } from "@/server/modules/finance/models";
import { useNavigate } from "@tanstack/react-router";
import { CalendarIcon, FileEdit, ReceiptIcon, Trash, X } from "lucide-react";
import { useState } from "react";
import { DeleteExpenseDialog } from "./delete-expense-dialog";

export type ExpenseColumnModel = {
  id: string;
  occurredAt: Date;
  amount: number;
  note: string | null;
  category: ExpenseCategory;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
});

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

type Props = {
  expenses: ExpenseColumnModel[];
  isLoading?: boolean;
  category?: ExpenseCategory;
  startDate?: Date;
  endDate?: Date;
  paginationData?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
};

export function ListExpensesTable({
  expenses,
  isLoading,
  category,
  startDate,
  endDate,
  paginationData,
}: Props) {
  const navigate = useNavigate({ from: "/expenses" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

  const hasActiveFilters = !!(category || startDate || endDate);

  const clearAllFilters = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        category: undefined,
        startDate: undefined,
        endDate: undefined,
      }),
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: newPage,
      }),
    });
  };

  // Format date to ISO string without timezone conversion
  const formatDateToLocalISO = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (isLoading)
    return (
      <div className="flex flex-col gap-y-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className={"grid grid-cols-7 gap-x-4"}>
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8 col-span-2" />
            <Skeleton className="h-8 col-span-2" />
            <Skeleton className="h-8" />
          </div>
        ))}
      </div>
    );

  if (!isLoading && expenses.length === 0 && !hasActiveFilters)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ReceiptIcon />
          </EmptyMedia>
          <EmptyTitle>No Expenses Recorded</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any expenses record yet. Get started by
            creating your first expense record.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button>Create Project</Button>
          </div>
        </EmptyContent>
      </Empty>
    );

  return (
    <div>
      <div className="grid grid-cols-12 gap-x-4 mb-2">
        <Input className="col-span-3" placeholder="Search by notes..." />

        <div className="col-span-3"></div>

        <ResponsiveCalendarSelector
          title="Start Date"
          description="Select start date for filtering expenses"
          calendarProps={{
            mode: "single",
            selected: startDate,
            onSelect: (date) => {
              navigate({
                search: (prev) => ({
                  ...prev,
                  startDate: date ? formatDateToLocalISO(date) : undefined,
                }),
              });
            },
          }}
        >
          <Button
            variant="outline"
            className="justify-between font-normal col-span-2"
          >
            {startDate ? dateFormatter.format(startDate) : "Start date"}
            <CalendarIcon className="text-gray-400" />
          </Button>
        </ResponsiveCalendarSelector>

        <ResponsiveCalendarSelector
          title="End Date"
          description="Select end date for filtering expenses"
          calendarProps={{
            mode: "single",
            selected: endDate,
            onSelect: (date) => {
              navigate({
                search: (prev) => ({
                  ...prev,
                  endDate: date ? formatDateToLocalISO(date) : undefined,
                }),
              });
            },
          }}
        >
          <Button
            variant="outline"
            className="justify-between font-normal col-span-2"
          >
            {endDate ? dateFormatter.format(endDate) : "End date"}
            <CalendarIcon className="text-gray-400" />
          </Button>
        </ResponsiveCalendarSelector>

        <ExpenseCategorySelector
          selectProps={{
            value: category ?? "__all__",
            onValueChange: (value) => {
              navigate({
                search: (prev) => ({
                  ...prev,
                  category:
                    value === "__all__"
                      ? undefined
                      : (value as ExpenseCategory),
                }),
              });
            },
          }}
          triggerProps={{ className: "w-full col-span-2" }}
        />
      </div>

      {paginationData && (
        <SimplePagination
          currentPage={paginationData.currentPage}
          totalPages={paginationData.totalPages}
          totalCount={paginationData.totalCount}
          pageSize={paginationData.pageSize}
          onPageChange={handlePageChange}
        />
      )}

      <Table className="*:border-border [&>:not(:last-child)]:border-r mt-2">
        <TableHeader>
          <TableRow>
            <TableHead className="w-50">Date</TableHead>
            <TableHead className="w-52">Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Note</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {expenses.length === 0 && hasActiveFilters && (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-muted-foreground">
                    No expenses match your current filters.
                  </p>
                  <Button variant="link" onClick={clearAllFilters}>
                    Clear all filters
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}

          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{dateFormatter.format(expense.occurredAt)}</TableCell>
              <TableCell>
                <ExpenseCategoryBadge category={expense.category} />
              </TableCell>
              <TableCell>{currencyFormatter.format(expense.amount)}</TableCell>
              <TableCell>{expense.note ?? "-"}</TableCell>
              <TableCell>
                <div className="flex gap-x-4">
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Edit</span>
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <DeleteExpenseDialog
                    id={expense.id}
                    open={deleteDialogOpen === expense.id}
                    onOpenChange={(open) =>
                      setDeleteDialogOpen(open ? expense.id : null)
                    }
                    triggerComponent={
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Delete</span>
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
