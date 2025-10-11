import { all } from "redux-saga/effects";
import Signup from "./auth/signupSaga";
import Login from "./auth/loginSaga";
import VerifyEmail from "./auth/verifyEmailSaga";
import Logout from "./auth/logoutSaga";
import GetUserData from "./auth/getUserDataSaga";
import UpdateUserBalanceExposure from "./auth/updateUserBalanceExposureSaga";
import CasinoGames from "./casinoSaga";
import UserBets from "./userBetsSaga";

export default function* rootSaga() {
  yield all([
    Signup(),
    Login(),
    VerifyEmail(),
    Logout(),
    GetUserData(),
    UpdateUserBalanceExposure(),
    CasinoGames(),
    UserBets(),
  ]);
}