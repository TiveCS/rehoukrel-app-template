import { failure, ok, type Result, validationError } from "@tivecs/core";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/infra/data";
import { expenses } from "@/infra/data/schemas";
import { ExpenseErrors } from "../../errors";
import {
  type EditExpenseUsecaseInput,
  type EditExpenseUsecaseOutput,
  editExpenseUsecaseInputSchema,
} from "./dto";

export async function editExpenseUsecase(
  input: EditExpenseUsecaseInput,
): Promise<Result<EditExpenseUsecaseOutput>> {
  const validated = editExpenseUsecaseInputSchema.safeParse(input);

  if (!validated.success) return validationError(validated.error);

  const [expense] = await db
    .select()
    .from(expenses)
    .where(
      and(
        eq(expenses.id, validated.data.expenseId),
        isNull(expenses.deletedAt),
      ),
    )
    .limit(1);

  if (!expense) {
    return failure(ExpenseErrors.NotFound);
  }

  if (expense.ownerId !== validated.data.ownerId) {
    return failure(ExpenseErrors.NotOwned);
  }

  const result = await db
    .update(expenses)
    .set({
      note: validated.data.note,
      category: validated.data.category,
      amount: validated.data.amount,
      occurredAt: validated.data.occurredAt,
      updatedAt: new Date(),
    })
    .where(eq(expenses.id, validated.data.expenseId))
    .returning({
      id: expenses.id,
      updatedAt: expenses.updatedAt,
    });

  return ok({
    id: result[0].id,
    updatedAt: result[0].updatedAt!,
  });
}
