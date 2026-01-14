// src/common/helpers/response.helper.ts
export const successResponse = <T>(message: string, data: T, code = 200) => {
  return {
    status: true,
    code,
    message,
    data,
  };
};

export const errorResponse = <T>(message: string, code = 400, errors?: T) => {
  return {
    status: false,
    code,
    message,
    errors,
  };
};
