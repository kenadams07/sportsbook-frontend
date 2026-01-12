import { combineReducers } from "redux";
import Signup from "./auth/signupReducer";
import Login from "./auth/loginReducer";
import VerifyEmail from "./auth/verifyEmailReducer";
import GetUserData from "./auth/getUserDataReducer";
import UpdateUserBalanceExposure from "./auth/updateUserBalanceExposureReducer";
import CasinoGames from "./casinoReducer";
import UserBets from "./userBetsReducer";
import MatchResults from "./matchResultsReducer";
import MarketReport from "./marketReportReducer";
import LiveState from "./liveReducer";

const appReducer = combineReducers({
  Signup,
  Login,
  VerifyEmail,
  GetUserData,
  UpdateUserBalanceExposure,
  CasinoGames,
  UserBets,
  MatchResults,
  MarketReport,
  LiveState,
});

const reducers = (state, action) => {
  return appReducer(state, action);
};

export default reducers;