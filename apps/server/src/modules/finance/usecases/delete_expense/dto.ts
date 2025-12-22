import z from "zod";

export const deleteExpenseUsecaseInputSchema = z.object({
  ownerId: z.uuid(),
  expenseId: z.uuid(),
});

export type DeleteExpenseUsecaseInput = z.infer<
  typeof deleteExpenseUsecaseInputSchema
>;

export type DeleteExpenseUsecaseOutput = {
  id: string;
  deletedAt: Date;
};
