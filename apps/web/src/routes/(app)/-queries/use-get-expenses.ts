import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { CommonErrors, isFailureResponseStruct } from "@tivecs/core";
import type { ExpenseCategory } from "@/server/modules/finance/models";

type Args = {
  page: number;
  search?: string;
  category?: ExpenseCategory;
  startDate?: string;
  endDate?: string;
};

export function useGetExpenses({
  page,
  search,
  category,
  startDate,
  endDate,
}: Args) {
  return useQuery({
    queryKey: ["expenses", page, search, category, startDate, endDate],
    queryFn: async () => {
      const response = await api.expenses.get({
        query: {
          page,
          pageSize: 10,
          sortBy: "occurredAt",
          sortDir: "desc",
          category,
          startDate,
          endDate,
        },
        fetch: {
          credentials: "include",
        },
      });

      if (!response) throw new Error("Failed to fetch expenses");

      if (response.error && isFailureResponseStruct(response.error.value)) {
        if (response.error.value.code === CommonErrors.ValidationError.code) {
          throw new Error(
            `Validation error: ${JSON.stringify(response.error.value.fieldErrors)}`,
          );
        }

        throw new Error(
          `Failed to fetch expenses data: ${response.error.value.code}`,
        );
      }

      return response.data;
    },
  });
}
