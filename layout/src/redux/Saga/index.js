import { all } from "redux-saga/effects";
import Signup from "./auth/signupSaga";
import Login from "./auth/loginSaga";
import VerifyEmail from "./auth/verifyEmailSaga";
import Logout from "./auth/logoutSaga";
import GetUserData from "./auth/getUserDataSaga";

export default function* rootSaga() {
  yield all([
    Signup(),
    Login(),
    VerifyEmail(),
    Logout(),
    GetUserData(),
  ]);
}