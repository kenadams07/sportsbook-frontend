import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import {
  notifyPromise,
} from "../../../utils/Helper";
import {
  verifyEmailSuccess,
  verifyEmailFailure,
} from "../../Action/auth/verifyEmailAction";
import { VERIFY_EMAIL } from "../../Action/actionTypes";

function* verifyEmailRequest(action) {
  try {
    let endpoint = "";
    const { route, payload } = action.payload;
    

    if (payload.hasOwnProperty('otp')) {
      // This is for verifying the OTP
      endpoint = "/users/verify-otp";
    } else if (payload.hasOwnProperty('email') && !payload.hasOwnProperty('otp')) {
      // This is for sending OTP
      endpoint = "/users/verifyemail";
    } else if (route === "FP") {
      // Forget password route
      endpoint = "/users/forget-password";
    }
    
    try {
      const { data } = yield notifyPromise(
        API.post(endpoint, payload)
      );

      if (data?.code==200) { 
       
        yield put(verifyEmailSuccess(data?.data));
   
        if (action.callback && typeof action.callback === 'function') {
          yield call(action.callback, data);
        }
        
      } else {
        yield put(verifyEmailFailure());
      }
    } catch (apiError) {
      console.error("API Error:", apiError);
      yield put(verifyEmailFailure());
    }
  } catch (error) {
    console.error("Saga Error:", error);
    yield put(verifyEmailFailure());
  }
}

export function* watchVerifyEmailAPI() {
  yield takeEvery(VERIFY_EMAIL, verifyEmailRequest);
}

export default function* rootSaga() {
  yield all([watchVerifyEmailAPI()]);
}