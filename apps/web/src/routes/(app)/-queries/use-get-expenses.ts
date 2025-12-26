import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
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

      if (response.error) {
        throw new Error(
          response.error
        );
      }

      return response.data;
    },
  });
}
