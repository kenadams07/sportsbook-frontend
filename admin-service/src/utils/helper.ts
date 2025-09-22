// src/common/helpers/response.helper.ts
export const successResponse = (message: string, data: any = null, code = 200) => {
  return {
    code,
    message,
    data,
  };
};

export const errorResponse = (message: string, code = 400, errors: any = null) => {
  return {
    code,
    message,
    errors,
  };
};