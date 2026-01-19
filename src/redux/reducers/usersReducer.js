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

const initialState = {
  users: [],
  loading: false,
  error: null,
  updatingBalance: false,
  updateBalanceError: null,
  updateBalanceSuccess: false,
  withdrawingBalance: false,
  withdrawBalanceError: null,
  withdrawBalanceSuccess: false,
  updatingPassword: false,
  updatePasswordError: null,
  updatePasswordSuccess: false,
  fetchingMarketReports: false,
  marketReports: null,
  marketReportsError: null
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADMIN_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case FETCH_ADMIN_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: null
      };
    
    case FETCH_ADMIN_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ADD_USER_BALANCE_REQUEST:
      return {
        ...state,
        updatingBalance: true,
        updateBalanceSuccess: false,
        updateBalanceError: null
      };
    
    case ADD_USER_BALANCE_SUCCESS:
      // Update the user in the users array with the new balance
      const updatedUsersForAdd = state.users.map(user => 
        user.id === action.payload.id ? { ...user, ...action.payload } : user
      );
      return {
        ...state,
        updatingBalance: false,
        updateBalanceSuccess: true,
        users: updatedUsersForAdd,
        updateBalanceError: null
      };
    
    case ADD_USER_BALANCE_FAILURE:
      return {
        ...state,
        updatingBalance: false,
        updateBalanceSuccess: false,
        updateBalanceError: action.payload
      };

    case WITHDRAW_USER_BALANCE_REQUEST:
      return {
        ...state,
        withdrawingBalance: true,
        withdrawBalanceSuccess: false,
        withdrawBalanceError: null
      };
    
    case WITHDRAW_USER_BALANCE_SUCCESS:
      // Update the user in the users array with the new balance
      const updatedUsersForWithdraw = state.users.map(user => 
        user.id === action.payload.id ? { ...user, ...action.payload } : user
      );
      return {
        ...state,
        withdrawingBalance: false,
        withdrawBalanceSuccess: true,
        users: updatedUsersForWithdraw,
        withdrawBalanceError: null
      };
    
    case WITHDRAW_USER_BALANCE_FAILURE:
      return {
        ...state,
        withdrawingBalance: false,
        withdrawBalanceSuccess: false,
        withdrawBalanceError: action.payload
      };

    case UPDATE_USER_PASSWORD_REQUEST:
      return {
        ...state,
        updatingPassword: true,
        updatePasswordSuccess: false,
        updatePasswordError: null
      };
    
    case UPDATE_USER_PASSWORD_SUCCESS:
      // Update the user in the users array with the new password
      const updatedUsersForPassword = state.users.map(user => 
        user.id === action.payload.id ? { ...user, ...action.payload } : user
      );
      return {
        ...state,
        updatingPassword: false,
        updatePasswordSuccess: true,
        users: updatedUsersForPassword,
        updatePasswordError: null
      };
    
    case UPDATE_USER_PASSWORD_FAILURE:
      return {
        ...state,
        updatingPassword: false,
        updatePasswordSuccess: false,
        updatePasswordError: action.payload
      };

    case FETCH_USER_MARKET_REPORTS_REQUEST:
      return {
        ...state,
        fetchingMarketReports: true,
        marketReportsError: null
      };
    
    case FETCH_USER_MARKET_REPORTS_SUCCESS:
      return {
        ...state,
        fetchingMarketReports: false,
        marketReports: action.payload,
        marketReportsError: null
      };
    
    case FETCH_USER_MARKET_REPORTS_FAILURE:
      return {
        ...state,
        fetchingMarketReports: false,
        marketReportsError: action.payload
      };

    default:
      return state;
  }
};

export default usersReducer;