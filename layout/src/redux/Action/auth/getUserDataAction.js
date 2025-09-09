import { GET_USER_DATA, GET_USER_DATA_SUCCESS, GET_USER_DATA_FAILURE } from "../actionTypes";

export const getUserData = (payload, callback) => ({
  type: GET_USER_DATA,
  payload,
  callback,
});

export const getUserDataSuccess = (payload) => ({
  type: GET_USER_DATA_SUCCESS,
  payload,
});

export const getUserDataFailure = () => ({
  type: GET_USER_DATA_FAILURE,
});