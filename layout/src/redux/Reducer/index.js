import { combineReducers } from "redux";
import Signup from "./auth/signupReducer";
import Login from "./auth/loginReducer";
import VerifyEmail from "./auth/verifyEmailReducer";


const appReducer = combineReducers({
  Signup,
  Login,
  VerifyEmail,

  
});


const reducers = (state, action) => {
  return appReducer(state, action);
};

export default reducers;