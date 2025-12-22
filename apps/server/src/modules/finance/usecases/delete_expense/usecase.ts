import { failure, ok, type Result, validationError } from "@tivecs/core";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/infra/data";
import { expenses } from "@/infra/data/schemas";
import { ExpenseErrors } from "../../errors";
import {
  type DeleteExpenseUsecaseInput,
  type DeleteExpenseUsecaseOutput,
  deleteExpenseUsecaseInputSchema,
} from "./dto";

export async function deleteExpenseUsecase(
  input: DeleteExpenseUsecaseInput,
): Promise<Result<DeleteExpenseUsecaseOutput>> {
  const validated = deleteExpenseUsecaseInputSchema.safeParse(input);

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

  const deletedAt = new Date();

  const result = await db
    .update(expenses)
    .set({
      deletedAt,
    })
    .where(eq(expenses.id, validated.data.expenseId))
    .returning({
      id: expenses.id,
      deletedAt: expenses.deletedAt,
    });

  return ok({
    id: result[0].id,
    deletedAt: result[0].deletedAt!,
  });
}
