import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommonErrors, isFailureResponseStruct } from "@tivecs/core";
import type { ExpenseCategory } from "@/server/modules/finance/models";

type CreateExpenseInput = {
  amount: number;
  occurredAt: string; // ISO date string
  category: ExpenseCategory;
  note?: string;
};

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateExpenseInput) => {
      const response = await api.expenses.post(input, {
        fetch: { credentials: "include" },
      });

      if (!response) throw new Error("Failed to create expense");

      if (response.error && isFailureResponseStruct(response.error.value)) {
        if (response.error.value.code === CommonErrors.ValidationError.code) {
          throw new Error(
            `Validation error: ${JSON.stringify(response.error.value.fieldErrors)}`,
          );
        }

        throw new Error(
          `Failed to create expense: ${response.error.value.code}`,
        );
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
