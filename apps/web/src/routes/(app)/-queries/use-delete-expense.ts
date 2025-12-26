import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api
        .expenses({ id })
        .delete(undefined, { fetch: { credentials: "include" } });

      if (response.error) {
        throw new Error(
          response.error.value?.error || "Failed to delete expense",
        );
      }

      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
