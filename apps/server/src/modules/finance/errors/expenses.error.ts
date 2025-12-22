import { type ErrorModel, HttpStatus } from "@tivecs/core";

export type ExpenseError = ErrorModel & {
  code: `expenses.${string}`;
};

export const ExpenseErrors = {
  NotFound: {
    code: "expenses.not_found",
    description: "The requested expense was not found.",
    statusCode: HttpStatus.NotFound,
  },
  NotOwned: {
    code: "expenses.not_owned",
    description: "The expense does not belong to the user.",
    statusCode: HttpStatus.Forbidden,
  },
} satisfies Record<string, ExpenseError>;
