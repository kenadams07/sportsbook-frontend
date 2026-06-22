type ResponseMeta = Record<string, unknown>;

export function successResponse(
  message: string,
  data: unknown = null,
  statusCode = 200,
  meta: ResponseMeta = {},
) {
  return {
    success: true,
    message,
    data,
    meta: {
      statusCode,
      ...meta,
    },
  };
}

export function errorResponse(
  message: string,
  statusCode = 500,
  errorCode?: string,
  data: unknown = null,
) {
  return {
    success: false,
    message,
    data,
    meta: {
      statusCode,
      ...(errorCode ? { errorCode } : {}),
    },
  };
}
