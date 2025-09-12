import { L as LOGOUT, a as LOGOUT_SUCCESS, b as LOGOUT_FAILURE, G as GET_USER_DATA, c as GET_USER_DATA_SUCCESS, d as GET_USER_DATA_FAILURE } from './__federation_expose_LayoutApp.js';

const logout = (payload, callback) => ({
  type: LOGOUT,
  payload,
  callback,
});

const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS,
});

const logoutFailure = () => ({
  type: LOGOUT_FAILURE,
});

const getUserData = (payload, callback) => ({
  type: GET_USER_DATA,
  payload,
  callback,
});

const getUserDataSuccess = (payload) => ({
  type: GET_USER_DATA_SUCCESS,
  payload,
});

const getUserDataFailure = () => ({
  type: GET_USER_DATA_FAILURE,
});

export { logoutSuccess as a, logoutFailure as b, getUserDataSuccess as c, getUserDataFailure as d, getUserData as g, logout as l };
