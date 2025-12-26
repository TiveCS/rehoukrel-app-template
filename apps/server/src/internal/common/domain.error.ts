import type { HttpStatus } from "@tivecs/core";

export abstract class DomainError extends Error {
  abstract readonly statusCode: HttpStatus;
  abstract readonly errorCode: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }

  toJson() {
    return {
      code: this.errorCode,
      message: this.message,
    };
  }
}
