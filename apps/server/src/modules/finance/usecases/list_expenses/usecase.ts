import { createPaginationResponse } from "@tivecs/core";
import { and, asc, desc, eq, gte, isNull, lte } from "drizzle-orm";
import { db } from "@/infra/data";
import { expenses } from "@/infra/data/schemas";
import {
  type ListExpensesUsecaseInput,
  type ListExpensesUsecaseOutput,
  listExpensesUsecaseInputSchema,
} from "./dto";

export async function listExpensesUsecase(
  input: ListExpensesUsecaseInput,
): Promise<ListExpensesUsecaseOutput> {
  const validated = listExpensesUsecaseInputSchema.parse(input);

  const conditions = [
    eq(expenses.ownerId, validated.ownerId),
    isNull(expenses.deletedAt),
  ];

  if (validated.category) {
    conditions.push(eq(expenses.category, validated.category));
  }

  if (validated.minAmount) {
    conditions.push(gte(expenses.amount, validated.minAmount));
  }

  if (validated.maxAmount) {
    conditions.push(lte(expenses.amount, validated.maxAmount));
  }

  if (validated.startDate) {
    conditions.push(gte(expenses.occurredAt, validated.startDate));
  }

  if (validated.endDate) {
    conditions.push(lte(expenses.occurredAt, validated.endDate));
  }

  const whereClause = and(...conditions);

  const totalItems = await db.$count(expenses, whereClause);

  const orderByClause =
    validated.sortDir === "asc"
      ? asc(expenses[validated.sortBy])
      : desc(expenses[validated.sortBy]);

  const offset = (validated.page - 1) * validated.pageSize;

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
    .limit(validated.pageSize)
    .offset(offset);

  return createPaginationResponse({
    page: validated.page,
    pageSize: validated.pageSize,
    totalItems,
    items: items.map((item) => ({
      ...item,
      occurredAt: item.occurredAt.toISOString().split("T")[0],
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
    })),
  });
}
