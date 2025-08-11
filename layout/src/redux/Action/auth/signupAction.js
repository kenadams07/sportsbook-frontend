import { SIGNUP, SIGNUP_SUCCESS, SIGNUP_FAILURE } from "../actionTypes";

export const signup = (payload) => ({
  type: SIGNUP,
  payload,
});

export const signupSuccess = (payload) => ({
  type: SIGNUP_SUCCESS,
  payload,
});

export const signupFailure = () => ({
  type: SIGNUP_FAILURE,
});
