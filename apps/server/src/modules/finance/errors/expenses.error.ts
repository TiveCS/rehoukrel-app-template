import { HttpStatus } from "@tivecs/core";
import { DomainError } from "@/internal/common";

export class ExpenseNotFoundError extends DomainError {
  statusCode: HttpStatus = HttpStatus.NotFound;
  errorCode: string = "expenses.not_found";

  constructor() {
    super("The requested expense not found");
  }
}

export class ExpenseNotOwnedError extends DomainError {
  statusCode: HttpStatus = HttpStatus.Forbidden;
  errorCode: string = "expenses.not_owned";

  constructor() {
    super("The requested expense does not belong to the user");
  }
}

export class ExpenseDeletedError extends DomainError {
  statusCode: HttpStatus = HttpStatus.Gone;
  errorCode: string = "expenses.deleted";

  constructor() {
    super("The requested expense has been deleted");
  }
}

// Export as namespace for convenient usage
export const ExpenseErrors = {
  NotFound: ExpenseNotFoundError,
  NotOwned: ExpenseNotOwnedError,
  Deleted: ExpenseDeletedError,
} as const;
