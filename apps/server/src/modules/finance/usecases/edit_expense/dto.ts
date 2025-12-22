import z from "zod";
import { ExpenseCategory } from "../../models";

export const editExpenseUsecaseInputSchema = z.object({
  expenseId: z.uuid(),
  ownerId: z.uuid(),
  note: z.string().max(50).optional(),
  category: z.enum(ExpenseCategory),
  amount: z.number().int().positive(),
  occurredAt: z.date(),
});

export type EditExpenseUsecaseInput = z.infer<
  typeof editExpenseUsecaseInputSchema
>;

export type EditExpenseUsecaseOutput = {
  id: string;
  updatedAt: Date;
};
