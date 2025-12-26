import { db } from "@/infra/data";
import { expenses } from "@/infra/data/schemas";
import {
  type NewExpenseUsecaseInput,
  type NewExpenseUsecaseOutput,
  newExpenseUsecaseInputSchema,
} from "./dto";

export async function newExpenseUsecase(
  input: NewExpenseUsecaseInput,
): Promise<NewExpenseUsecaseOutput> {
  const validated = newExpenseUsecaseInputSchema.parse(input);

  const result = await db
    .insert(expenses)
    .values({
      note: validated.note,
      amount: validated.amount,
      occurredAt: validated.occurredAt,
      ownerId: validated.ownerId,
      category: validated.category,
    })
    .returning({
      id: expenses.id,
      createdAt: expenses.createdAt,
    });

  return {
    id: result[0].id,
    createdAt: result[0].createdAt,
  };
}
