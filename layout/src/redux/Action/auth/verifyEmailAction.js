import {
  VERIFY_EMAIL,
  VERIFY_EMAIL_SUCCESS,
  VERIFY_EMAIL_FAILURE,
} from "../actionTypes";

export const verifyEmail = (payload, callback) => ({
  type: VERIFY_EMAIL,
  payload,
  callback,
});

export const verifyEmailSuccess = (data) => ({
  type: VERIFY_EMAIL_SUCCESS,
  payload: data,
});

export const verifyEmailFailure = (error) => ({
  type: VERIFY_EMAIL_FAILURE,
  payload: error,
});