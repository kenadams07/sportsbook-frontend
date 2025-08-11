import { all } from "redux-saga/effects";
import Signup from "./auth/signupSaga";
import Login from "./auth/loginSaga";


export default function* rootSaga() {
  yield all([
    Signup(),
    Login(),
  ]);
}