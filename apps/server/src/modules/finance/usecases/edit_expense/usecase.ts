import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/infra/data";
import { expenses } from "@/infra/data/schemas";
import { ExpenseNotFoundError, ExpenseNotOwnedError } from "../../errors";
import {
  type EditExpenseUsecaseInput,
  type EditExpenseUsecaseOutput,
  editExpenseUsecaseInputSchema,
} from "./dto";

export async function editExpenseUsecase(
  input: EditExpenseUsecaseInput,
): Promise<EditExpenseUsecaseOutput> {
  const validated = editExpenseUsecaseInputSchema.parse(input);

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

  const result = await db
    .update(expenses)
    .set({
      note: validated.note,
      category: validated.category,
      amount: validated.amount,
      occurredAt: validated.occurredAt,
      updatedAt: new Date(),
    })
    .where(eq(expenses.id, validated.expenseId))
    .returning({
      id: expenses.id,
      updatedAt: expenses.updatedAt,
    });

  return {
    id: result[0].id,
    updatedAt: result[0].updatedAt!,
  };
}
