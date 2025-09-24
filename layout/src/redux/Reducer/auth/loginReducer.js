import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
  UPDATE_USER_BALANCE_EXPOSURE,
  UPDATE_USER_BALANCE_EXPOSURE_SUCCESS,
  GET_USER_DATA_SUCCESS
} from "../../Action/actionTypes";
import { getLocalStorageItem } from "../../../utils/Helper";

const INIT_STATE = {
  loading: false,
  userData: getLocalStorageItem("userData") || {},
  isAuthenticated: !!getLocalStorageItem("token"),
};

const loginReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, loading: true, isAuthenticated: false, error: null };
    case LOGIN_SUCCESS:
      return {
        ...state,
        userData: action.payload,
        loading: false,
        isAuthenticated: true,
        error: null
      };
    case LOGIN_FAILURE:
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false,
        error: action.error
      };
    case LOGOUT_SUCCESS:
      return { ...state, userData: {}, loading: false, isAuthenticated: false, error: null };
    case UPDATE_USER_BALANCE_EXPOSURE:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_USER_BALANCE_EXPOSURE_SUCCESS:
      return {
        ...state,
        loading: false,
        userData: {
          ...state.userData,
          balance: action.payload.balance,
          exposure: action.payload.exposure,
        },
      };
    case GET_USER_DATA_SUCCESS:
      // Update the userData in the login reducer when getUserData is successful
      // Replace the entire userData object to ensure consistency
      return {
        ...state,
        userData: action.payload,
      };

    default:
      return state;
  }
};

export default loginReducer;