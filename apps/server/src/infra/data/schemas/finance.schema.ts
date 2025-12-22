import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { ExpenseCategory } from "@/modules/finance/models";
import { cuidPrimaryKey } from "../schema.helper";
import { users } from "./auth.schema";

export const expenseCategories = pgEnum("expense_categories", ExpenseCategory);

export const expenses = pgTable("expenses", {
  id: cuidPrimaryKey("id"),
  note: varchar("note", { length: 50 }),
  amount: integer("amount").notNull(),
  ownerId: uuid("owner_id")
    .references(() => users.id)
    .notNull(),
  category: expenseCategories("category").notNull(),
  occurredAt: date("occurred_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});

export const expensesRelations = relations(expenses, ({ one }) => ({
  owner: one(users, {
    fields: [expenses.ownerId],
    references: [users.id],
  }),
}));
