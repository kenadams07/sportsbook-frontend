export function serializeError(error: unknown) {
  if (error instanceof Error) {
    const maybeStatus = "status" in error ? error.status : undefined;
    const maybeCode = "code" in error ? error.code : undefined;

    return {
      name: error.name,
      message: error.message,
      ...(typeof maybeStatus === "number" ? { status: maybeStatus } : {}),
      ...(typeof maybeCode === "string" ? { code: maybeCode } : {}),
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}
