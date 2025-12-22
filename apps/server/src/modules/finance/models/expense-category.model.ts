export const ExpenseCategory = {
  Food: "food",
  Transportation: "transportation",
  Utilities: "utilities",
} as const;

export type ExpenseCategory =
  (typeof ExpenseCategory)[keyof typeof ExpenseCategory];
