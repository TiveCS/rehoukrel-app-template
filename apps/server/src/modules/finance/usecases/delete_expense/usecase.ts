import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/infra/data";
import { expenses } from "@/infra/data/schemas";
import {
  ExpenseNotFoundError,
  ExpenseNotOwnedError,
  ExpenseDeletedError,
} from "../../errors";
import {
  type DeleteExpenseUsecaseInput,
  type DeleteExpenseUsecaseOutput,
  deleteExpenseUsecaseInputSchema,
} from "./dto";

export async function deleteExpenseUsecase(
  input: DeleteExpenseUsecaseInput,
): Promise<DeleteExpenseUsecaseOutput> {
  const validated = deleteExpenseUsecaseInputSchema.parse(input);

  const [expense] = await db
    .select()
    .from(expenses)
    .where(
      and(
        eq(expenses.id, validated.expenseId),
        isNull(expenses.deletedAt),
      ),
    )
    .limit(1);

  if (!expense) {
    throw new ExpenseNotFoundError();
  }

  if (expense.ownerId !== validated.ownerId) {
    throw new ExpenseNotOwnedError();
  }

  const deletedAt = new Date();

  const result = await db
    .update(expenses)
    .set({
      deletedAt,
    })
    .where(eq(expenses.id, validated.expenseId))
    .returning({
      id: expenses.id,
      deletedAt: expenses.deletedAt,
    });

  return {
    id: result[0].id,
    deletedAt: result[0].deletedAt!,
  };
}
