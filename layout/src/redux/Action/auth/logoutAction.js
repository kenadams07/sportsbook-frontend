import { LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAILURE } from "../actionTypes";

export const logout = (payload, callback) => ({
  type: LOGOUT,
  payload,
  callback,
});

export const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS,
});

export const logoutFailure = () => ({
  type: LOGOUT_FAILURE,
});