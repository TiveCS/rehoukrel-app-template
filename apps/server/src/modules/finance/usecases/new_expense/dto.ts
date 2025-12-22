import z from "zod";
import { ExpenseCategory } from "../../models";

export const newExpenseUsecaseInputSchema = z.object({
  note: z.string().max(50).optional(),
  category: z.enum(ExpenseCategory),
  amount: z.int().positive(),
  occurredAt: z.date(),
  ownerId: z.uuid(),
});

export type NewExpenseUsecaseInput = z.infer<
  typeof newExpenseUsecaseInputSchema
>;

export type NewExpenseUsecaseOutput = {
  id: string;
  createdAt: Date;
};
