import { ok, type Result, validationError } from "@tivecs/core";
import { and, asc, count, desc, eq, gte, isNull, lte, sql } from "drizzle-orm";
import { db } from "@/infra/data";
import { expenses } from "@/infra/data/schemas";
import {
  type ListExpensesUsecaseInput,
  type ListExpensesUsecaseOutput,
  listExpensesUsecaseInputSchema,
} from "./dto";

export async function listExpensesUsecase(
  input: ListExpensesUsecaseInput,
): Promise<Result<ListExpensesUsecaseOutput>> {
  const validated = listExpensesUsecaseInputSchema.safeParse(input);

  if (!validated.success) return validationError(validated.error);

  const conditions = [
    eq(expenses.ownerId, validated.data.ownerId),
    isNull(expenses.deletedAt),
  ];

  if (validated.data.category) {
    conditions.push(eq(expenses.category, validated.data.category));
  }

  if (validated.data.minAmount) {
    conditions.push(gte(expenses.amount, validated.data.minAmount));
  }

  if (validated.data.maxAmount) {
    conditions.push(lte(expenses.amount, validated.data.maxAmount));
  }

  if (validated.data.startDate) {
    conditions.push(gte(expenses.occurredAt, validated.data.startDate));
  }

  if (validated.data.endDate) {
    conditions.push(lte(expenses.occurredAt, validated.data.endDate));
  }

  const whereClause = and(...conditions);

  const [totalResult] = await db
    .select({ count: count() })
    .from(expenses)
    .where(whereClause);

  const total = totalResult.count;
  const totalPages = Math.ceil(total / validated.data.pageSize);

  const orderByClause =
    validated.data.sortDir === "asc"
      ? asc(expenses[validated.data.sortBy])
      : desc(expenses[validated.data.sortBy]);

  const offset = (validated.data.page - 1) * validated.data.pageSize;

  const items = await db
    .select({
      id: expenses.id,
      note: expenses.note,
      category: expenses.category,
      amount: expenses.amount,
      occurredAt: expenses.occurredAt,
      createdAt: expenses.createdAt,
      updatedAt: expenses.updatedAt,
    })
    .from(expenses)
    .where(whereClause)
    .orderBy(orderByClause)
    .limit(validated.data.pageSize)
    .offset(offset);

  return ok({
    items,
    total,
    page: validated.data.page,
    limit: validated.data.pageSize,
    totalPages,
  });
}
