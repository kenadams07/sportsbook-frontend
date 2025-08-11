import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
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
      return { ...state, loading: true, isAuthenticated: false };
    case LOGIN_SUCCESS:
      return {
        ...state,
        userData: action?.payload,
        loading: false,
        isAuthenticated: true,
      };
    case LOGIN_FAILURE:
      return { ...state, loading: false, isAuthenticated: false };
    case LOGOUT_SUCCESS:
      return { ...state, userData: {}, loading: false, isAuthenticated: false };
    default:
      return state;
  }
};

export default loginReducer;
