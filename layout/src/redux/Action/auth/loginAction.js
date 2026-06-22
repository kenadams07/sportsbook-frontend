import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_VERIFICATION_PENDING,
} from "../actionTypes";

export const login = (payload, callback) => ({
  type: LOGIN,
  payload,
  callback,
});

export const loginSuccess = (payload) => ({
  type: LOGIN_SUCCESS,
  payload,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  error,
});

export const loginVerificationPending = (payload) => ({
  type: LOGIN_VERIFICATION_PENDING,
  payload,
});
