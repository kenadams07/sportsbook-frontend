import { call, put, takeLatest } from 'redux-saga/effects';
import { addUserBalanceFailure, fetchAdminUsersFailure, withdrawUserBalanceFailure, updateUserPasswordFailure, fetchUserMarketReportsFailure } from '../actions/usersActions';
import { api } from '../../services/api';
import {
  ADD_USER_BALANCE_REQUEST,
  ADD_USER_BALANCE_SUCCESS,
  WITHDRAW_USER_BALANCE_REQUEST,
  WITHDRAW_USER_BALANCE_SUCCESS,
  UPDATE_USER_PASSWORD_REQUEST,
  UPDATE_USER_PASSWORD_SUCCESS,
  FETCH_USER_MARKET_REPORTS_REQUEST,
  FETCH_USER_MARKET_REPORTS_SUCCESS,
  FETCH_ADMIN_USERS_REQUEST,
  FETCH_ADMIN_USERS_SUCCESS,
} from '../actiontypes/usersTypes';

// Saga to handle adding user balance
function* addUserBalanceSaga(action) {
  try {
    const { userId, amount } = action.payload;
    
    // Make the API call to add user balance
    const result = yield call(api.addUserBalance, userId, parseFloat(amount));
    
    if (result && result.status === true) {
      // Fetch updated user data to get the new balance
      const usersResponse = yield call(api.getAdminUsers);
      if (usersResponse && usersResponse.data) {
        // Find the updated user in the response
        const updatedUser = usersResponse.data.find(u => u.id === userId);
        if (updatedUser) {
          yield put({ type: ADD_USER_BALANCE_SUCCESS, payload: updatedUser });
        } else {
          yield put({ type: ADD_USER_BALANCE_SUCCESS, payload: result.data || { id: userId, balance: result.data?.newBalance } });
        }
      } else {
        yield put({ type: ADD_USER_BALANCE_SUCCESS, payload: result.data || { id: userId, balance: result.data?.newBalance } });
      }
    } else {
      yield put(addUserBalanceFailure(result.message || 'Failed to add balance'));
    }
  } catch (error) {
    yield put(addUserBalanceFailure(error.message));
  }
}

// Saga to handle withdrawing user balance
function* withdrawUserBalanceSaga(action) {
  try {
    const { userId, amount } = action.payload;
    
    // Make the API call to withdraw user balance
    const result = yield call(api.withdrawUserBalance, userId, parseFloat(amount));
    
    if (result && result.status === true) {
      // Fetch updated user data to get the new balance
      const usersResponse = yield call(api.getAdminUsers);
      if (usersResponse && usersResponse.data) {
        // Find the updated user in the response
        const updatedUser = usersResponse.data.find(u => u.id === userId);
        if (updatedUser) {
          yield put({ type: WITHDRAW_USER_BALANCE_SUCCESS, payload: updatedUser });
        } else {
          yield put({ type: WITHDRAW_USER_BALANCE_SUCCESS, payload: result.data || { id: userId, balance: result.data?.newBalance } });
        }
      } else {
        yield put({ type: WITHDRAW_USER_BALANCE_SUCCESS, payload: result.data || { id: userId, balance: result.data?.newBalance } });
      }
    } else {
      yield put(withdrawUserBalanceFailure(result.message || 'Failed to withdraw balance'));
    }
  } catch (error) {
    yield put(withdrawUserBalanceFailure(error.message));
  }
}

// Saga to handle updating user password
function* updateUserPasswordSaga(action) {
  try {
    const { userId, newPassword } = action.payload;
    
    // Make the API call to update user password
    const result = yield call(api.updateUserPassword, userId, newPassword);
    
    if (result && result.status === true) {
      // Fetch updated user data
      const usersResponse = yield call(api.getAdminUsers);
      if (usersResponse && usersResponse.data) {
        // Find the updated user in the response
        const updatedUser = usersResponse.data.find(u => u.id === userId);
        if (updatedUser) {
          yield put({ type: UPDATE_USER_PASSWORD_SUCCESS, payload: updatedUser });
        } else {
          yield put({ type: UPDATE_USER_PASSWORD_SUCCESS, payload: result.data || { id: userId } });
        }
      } else {
        yield put({ type: UPDATE_USER_PASSWORD_SUCCESS, payload: result.data || { id: userId } });
      }
    } else {
      yield put(updateUserPasswordFailure(result.message || 'Failed to update password'));
    }
  } catch (error) {
    yield put(updateUserPasswordFailure(error.message));
  }
}

// Saga to handle fetching user market reports
function* fetchUserMarketReportsSaga(action) {
  try {
    const { userId } = action.payload;
    
    // Make the API call to fetch user market reports
    const result = yield call(api.fetchUserMarketReports, userId);
    
    if (result && result.status === true) {
      yield put({ type: FETCH_USER_MARKET_REPORTS_SUCCESS, payload: result.data });
    } else {
      yield put(fetchUserMarketReportsFailure(result.message || 'Failed to fetch market reports'));
    }
  } catch (error) {
    yield put(fetchUserMarketReportsFailure(error.message));
  }
}

// Saga to handle fetching admin users
function* fetchAdminUsersSaga() {
  try {
    const response = yield call(api.getAdminUsers);
    if (response && response.data) {
      yield put({ type: FETCH_ADMIN_USERS_SUCCESS, payload: response.data });
    } else {
      yield put({ type: FETCH_ADMIN_USERS_SUCCESS, payload: [] });
    }
  } catch (error) {
    yield put(fetchAdminUsersFailure(error.message));
  }
}

// Watcher sagas
function* watchAddUserBalance() {
  yield takeLatest(ADD_USER_BALANCE_REQUEST, addUserBalanceSaga);
}

function* watchWithdrawUserBalance() {
  yield takeLatest(WITHDRAW_USER_BALANCE_REQUEST, withdrawUserBalanceSaga);
}

function* watchUpdateUserPassword() {
  yield takeLatest(UPDATE_USER_PASSWORD_REQUEST, updateUserPasswordSaga);
}

function* watchFetchUserMarketReports() {
  yield takeLatest(FETCH_USER_MARKET_REPORTS_REQUEST, fetchUserMarketReportsSaga);
}

function* watchFetchAdminUsers() {
  yield takeLatest(FETCH_ADMIN_USERS_REQUEST, fetchAdminUsersSaga);
}

export {
  watchAddUserBalance,
  watchWithdrawUserBalance,
  watchUpdateUserPassword,
  watchFetchUserMarketReports,
  watchFetchAdminUsers
};