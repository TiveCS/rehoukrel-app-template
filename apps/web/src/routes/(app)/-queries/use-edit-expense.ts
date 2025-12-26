import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExpenseCategory } from "@/server/modules/finance/models";

type EditExpenseInput = {
  id: string;
  amount: number;
  occurredAt: string; // ISO date string
  category: ExpenseCategory;
  note?: string;
};

export function useEditExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: EditExpenseInput) => {
      const response = await api.expenses({ id }).put(input, {
        fetch: { credentials: "include" },
      });

      if (response.error) {
        throw new Error(
          response.error.value?.error || "Failed to edit expense",
        );
      }

      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
