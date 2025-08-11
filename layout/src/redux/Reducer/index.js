import { combineReducers } from "redux";
import Signup from "./auth/signupReducer";
import Login from "./auth/loginReducer";


const appReducer = combineReducers({
  Signup,
  Login,

  
});


const reducers = (state, action) => {
  return appReducer(state, action);
};

export default reducers;