import { combineReducers } from "redux";
import Signup from "./auth/signupReducer";
import Login from "./auth/loginReducer";
import VerifyEmail from "./auth/verifyEmailReducer";
import GetUserData from "./auth/getUserDataReducer";
import UpdateUserBalanceExposure from "./auth/updateUserBalanceExposureReducer";

const appReducer = combineReducers({
  Signup,
  Login,
  VerifyEmail,
  GetUserData,
  UpdateUserBalanceExposure,
});

const reducers = (state, action) => {
  return appReducer(state, action);
};

export default reducers;