import { ok, type Result, validationError } from "@tivecs/core";
import { db } from "@/infra/data";
import { expenses } from "@/infra/data/schemas";
import {
  type NewExpenseUsecaseInput,
  type NewExpenseUsecaseOutput,
  newExpenseUsecaseInputSchema,
} from "./dto";

export async function newExpenseUsecase(
  input: NewExpenseUsecaseInput,
): Promise<Result<NewExpenseUsecaseOutput>> {
  const validated = newExpenseUsecaseInputSchema.safeParse(input);

  if (!validated.success) return validationError(validated.error);

  const result = await db
    .insert(expenses)
    .values({
      note: validated.data.note,
      amount: validated.data.amount,
      occurredAt: validated.data.occurredAt,
      ownerId: validated.data.ownerId,
      category: validated.data.category,
    })
    .returning({
      id: expenses.id,
      createdAt: expenses.createdAt,
    });

  return ok({
    id: result[0].id,
    createdAt: result[0].createdAt,
  });
}
