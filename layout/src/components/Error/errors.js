// src/errors.js
export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class GeneralError extends Error {
  constructor(message) {
    super(message);
    this.name = "GeneralError";
  }
}
