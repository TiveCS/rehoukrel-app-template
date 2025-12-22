import {
  paginationRequestSchema,
  paginationResponseSchema,
  zodIsoDateSchema,
  zodIsoDatetimeSchema,
} from "@tivecs/core";
import z from "zod";
import { ExpenseCategory } from "../../models";

export const postExpensesRouteRequestSchema = z.object({
  note: z.string().max(50).optional(),
  category: z.enum(ExpenseCategory),
  amount: z.int().positive(),
  occurredAt: zodIsoDateSchema,
});

export const putExpensesRouteRequestSchema = z.object({
  note: z.string().max(50).optional(),
  category: z.enum(ExpenseCategory),
  amount: z.int().positive(),
  occurredAt: zodIsoDateSchema,
});

export const getExpensesRouteRequestSchema = paginationRequestSchema.extend({
  sortBy: z.enum(["occurredAt", "amount"]),
  sortDir: z.enum(["asc", "desc"]),
  minAmount: z.int().positive().optional(),
  maxAmount: z.int().positive().optional(),
  startDate: zodIsoDateSchema.optional(),
  endDate: zodIsoDateSchema.optional(),
  category: z.enum(ExpenseCategory).optional(),
});

export const postExpensesRouteResponseSchema = z.object({
  id: z.cuid2(),
  createdAt: z.iso.datetime(),
});

export const putExpensesRouteResponseSchema = z.object({
  id: z.cuid2(),
  updatedAt: z.iso.datetime(),
});

export const deleteExpensesRouteResponseSchema = z.object({
  id: z.cuid2(),
  deletedAt: z.iso.datetime(),
});

export const getExpensesRouteResponseSchema = paginationResponseSchema(
  z.object({
    id: z.cuid2(),
    note: z.string().max(50).nullable(),
    category: z.enum(ExpenseCategory),
    amount: z.int().positive(),
    occurredAt: zodIsoDateSchema,
    createdAt: zodIsoDatetimeSchema,
    updatedAt: zodIsoDatetimeSchema.nullable(),
  }),
);
