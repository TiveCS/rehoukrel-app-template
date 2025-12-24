import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommonErrors, isFailureResponseStruct } from "@tivecs/core";

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api
        .expenses({ id })
        .delete(undefined, { fetch: { credentials: "include" } });

      if (!response) throw new Error("Failed to delete expense");

      if (response.error && isFailureResponseStruct(response.error.value)) {
        if (response.error.value.code === CommonErrors.ValidationError.code) {
          throw new Error(
            `Validation error: ${JSON.stringify(response.error.value.fieldErrors)}`,
          );
        }

        throw new Error(
          `Failed to delete expense: ${response.error.value.code}`,
        );
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
