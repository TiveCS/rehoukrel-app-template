export const ExpenseCategory = {
  Food: "food",
  Transportation: "transportation",
  Education: "education",
  Entertainment: "entertainment",
  Health: "health",
  Shopping: "shopping",
  Travel: "travel",
  Investment: "investment",
  Household: "household",
  Utilities: "utilities",
  Others: "others",
} as const;

export type ExpenseCategory =
  (typeof ExpenseCategory)[keyof typeof ExpenseCategory];
