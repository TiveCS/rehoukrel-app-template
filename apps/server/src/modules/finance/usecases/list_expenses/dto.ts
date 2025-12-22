import { paginationRequestSchema } from "@tivecs/core";
import z from "zod";
import { ExpenseCategory } from "../../models";

export const listExpensesUsecaseInputSchema = paginationRequestSchema.extend({
  sortBy: z.enum(["occurredAt", "amount"]),
  sortDir: z.enum(["asc", "desc"]),
  minAmount: z.number().int().positive().optional(),
  maxAmount: z.number().int().positive().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  category: z.enum(ExpenseCategory).optional(),
  ownerId: z.uuid(),
});

export type ListExpensesUsecaseInput = z.infer<
  typeof listExpensesUsecaseInputSchema
>;

export type ListExpensesUsecaseOutput = {
  items: {
    id: string;
    note: string | null;
    category: (typeof ExpenseCategory)[keyof typeof ExpenseCategory];
    amount: number;
    occurredAt: Date;
    createdAt: Date;
    updatedAt: Date | null;
  }[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
