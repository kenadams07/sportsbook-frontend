import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import {
  verifyEmailSuccess,
  verifyEmailFailure,
} from "../../Action/auth/verifyEmailAction";
import { VERIFY_EMAIL } from "../../Action/actionTypes";
import { notifyPromise } from "../../../utils/notificationService";

function* verifyEmailRequest(action) {
  try {
    let endpoint = "";
    const { route, payload } = action.payload;
    
    let notificationOptions = {};

    if (payload.hasOwnProperty('otp')) {
      // This is for verifying the OTP
      endpoint = "/users/verify-otp";
      notificationOptions = {
        loadingText: "Verifying OTP...",
        getSuccessMessage: (res) => {
          if (res?.data?.code === 200) {
            return res?.data?.message || "OTP verified successfully";
          }
          return null;
        },
        getErrorMessage: (err) => {
          return err?.response?.data?.message || err?.message || "Failed to verify OTP";
        },
        successTitle: "OTP Verification",
        errorTitle: "OTP Verification Failed"
      };
    } else if (payload.hasOwnProperty('email') && !payload.hasOwnProperty('otp')) {
      // This is for sending OTP
      endpoint = "/users/verifyemail";
      notificationOptions = {
        loadingText: "Sending OTP...",
        getSuccessMessage: (res) => {
          if (res?.data?.code === 200) {
            return res?.data?.message || "OTP sent to your email";
          }
          return null;
        },
        getErrorMessage: (err) => {
          return err?.response?.data?.message || err?.message || "Failed to send OTP";
        },
        successTitle: "OTP Sent",
        errorTitle: "OTP Sending Failed"
      };
    } else if (route === "FP") {
      // Forget password route
      endpoint = "/users/forget-password";
      notificationOptions = {
        loadingText: "Processing...",
        getSuccessMessage: (res) => {
          if (res?.data?.code === 200) {
            return res?.data?.message || "Request processed successfully";
          }
          return null;
        },
        getErrorMessage: (err) => {
          return err?.response?.data?.message || err?.message || "Failed to process request";
        }
      };
    }
    
    try {
      const { data } = yield call(() =>
        notifyPromise(() => API.post(endpoint, payload), notificationOptions)
      );

      if (data?.code === 200) { 
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