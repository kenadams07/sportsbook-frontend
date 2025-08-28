import { SIGNUP, SIGNUP_SUCCESS, SIGNUP_FAILURE } from "../actionTypes";

export const signup = (payload, callback) => ({
  type: SIGNUP,
  payload,
  callback,
});

export const signupSuccess = (payload) => ({
  type: SIGNUP_SUCCESS,
  payload,
});

export const signupFailure = () => ({
  type: SIGNUP_FAILURE,
});