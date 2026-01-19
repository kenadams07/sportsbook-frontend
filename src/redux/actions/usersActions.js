import {
  ADD_USER_BALANCE_REQUEST,
  ADD_USER_BALANCE_SUCCESS,
  ADD_USER_BALANCE_FAILURE,
  WITHDRAW_USER_BALANCE_REQUEST,
  WITHDRAW_USER_BALANCE_SUCCESS,
  WITHDRAW_USER_BALANCE_FAILURE,
  UPDATE_USER_PASSWORD_REQUEST,
  UPDATE_USER_PASSWORD_SUCCESS,
  UPDATE_USER_PASSWORD_FAILURE,
  FETCH_USER_MARKET_REPORTS_REQUEST,
  FETCH_USER_MARKET_REPORTS_SUCCESS,
  FETCH_USER_MARKET_REPORTS_FAILURE,
  FETCH_ADMIN_USERS_REQUEST,
  FETCH_ADMIN_USERS_SUCCESS,
  FETCH_ADMIN_USERS_FAILURE
} from '../actiontypes/usersTypes';

// Action creators for adding user balance
export const addUserBalanceRequest = (userId, amount) => ({
  type: ADD_USER_BALANCE_REQUEST,
  payload: { userId, amount }
});

export const addUserBalanceSuccess = (userData) => ({
  type: ADD_USER_BALANCE_SUCCESS,
  payload: userData
});

export const addUserBalanceFailure = (error) => ({
  type: ADD_USER_BALANCE_FAILURE,
  payload: error
});

// Action creators for withdrawing user balance
export const withdrawUserBalanceRequest = (userId, amount) => ({
  type: WITHDRAW_USER_BALANCE_REQUEST,
  payload: { userId, amount }
});

export const withdrawUserBalanceSuccess = (userData) => ({
  type: WITHDRAW_USER_BALANCE_SUCCESS,
  payload: userData
});

export const withdrawUserBalanceFailure = (error) => ({
  type: WITHDRAW_USER_BALANCE_FAILURE,
  payload: error
});

// Action creators for updating user password
export const updateUserPasswordRequest = (userId, newPassword) => ({
  type: UPDATE_USER_PASSWORD_REQUEST,
  payload: { userId, newPassword }
});

export const updateUserPasswordSuccess = (userData) => ({
  type: UPDATE_USER_PASSWORD_SUCCESS,
  payload: userData
});

export const updateUserPasswordFailure = (error) => ({
  type: UPDATE_USER_PASSWORD_FAILURE,
  payload: error
});

// Action creators for fetching user market reports
export const fetchUserMarketReportsRequest = (userId) => ({
  type: FETCH_USER_MARKET_REPORTS_REQUEST,
  payload: { userId }
});

export const fetchUserMarketReportsSuccess = (data) => ({
  type: FETCH_USER_MARKET_REPORTS_SUCCESS,
  payload: data
});

export const fetchUserMarketReportsFailure = (error) => ({
  type: FETCH_USER_MARKET_REPORTS_FAILURE,
  payload: error
});

// Action creators for fetching admin users
export const fetchAdminUsersRequest = () => ({
  type: FETCH_ADMIN_USERS_REQUEST
});

export const fetchAdminUsersSuccess = (users) => ({
  type: FETCH_ADMIN_USERS_SUCCESS,
  payload: users
});

export const fetchAdminUsersFailure = (error) => ({
  type: FETCH_ADMIN_USERS_FAILURE,
  payload: error
});