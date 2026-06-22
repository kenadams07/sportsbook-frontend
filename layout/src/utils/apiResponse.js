export function isApiSuccess(body) {
  return body?.success === true;
}

export function getApiMessage(body, fallback = "Success") {
  return body?.message || body?.meta?.message || fallback;
}

export function getApiErrorMessage(error, fallback = "Something went wrong") {
  const body = error?.response?.data;
  return body?.message || body?.meta?.message || error?.message || fallback;
}

export function getApiStatusCode(bodyOrError) {
  const body = bodyOrError?.response?.data ?? bodyOrError;
  return body?.meta?.statusCode ?? bodyOrError?.response?.status;
}

export function unwrapApiResponse(response) {
  const body = response?.data;

  if (!isApiSuccess(body)) {
    throw new Error(getApiMessage(body, "Something went wrong"));
  }

  return {
    data: body.data,
    message: body.message,
    meta: body.meta ?? {},
    raw: body,
  };
}
