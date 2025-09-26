import { all, call, put, takeEvery } from "redux-saga/effects";
// This saga handles the exposure update API call with the following payload structure:
// - eventId: ID of the selected event
// - marketId: ID of the market
// - userId: ID of the user placing the bet
// - is_clear: flag indicating if the bet is settled
// - marketType: type of market (e.g., "matchOdds")
// - stake: amount being bet (from the component)
// - sportsid: ID of the sport
// - runnerid: ID of the selected runner
// - runnername: name of the selected team/runner
// - odds: odds value for the selected bet
// - balance: updated user balance

import API from "../../../utils/api";
import { getLocalStorageItem, setLocalStorageItem } from "../../../utils/Helper";
import { notifyPromise } from "../../../utils/notificationService";
import { 
  UPDATE_USER_BALANCE_EXPOSURE,
  UPDATE_USER_BALANCE_EXPOSURE_SUCCESS,
  UPDATE_USER_BALANCE_EXPOSURE_FAILURE
} from "../../Action/actionTypes";
import { 
  updateUserBalanceExposureSuccess,
  updateUserBalanceExposureFailure
} from "../../Action/auth/updateUserBalanceExposureAction";
import { getUserDataSuccess } from "../../Action/auth/getUserDataAction";

function* updateUserBalanceExposureRequest(action) {
  try {
    const userData = getLocalStorageItem("userData");
    const userId = userData?._id;
    
    if (!userId) {
      yield put(updateUserBalanceExposureFailure());
      return;
    }

    // Create payload by combining all fields from action.payload with userId
    // We preserve all fields as sent from the component, including stake
    const payload = {
      ...action.payload,
      userId: userId,
    };
    
    const response = yield call(() =>
      notifyPromise(
        () => API.post("/sportBets/place-bet", payload),
        {
          loadingText: "Updating exposure...",
          getSuccessMessage: (res) => {
            if (res?.data?.success === true) {
              return res.data.message || "Bet Placed successfully";
            } else if (
              res?.data?.meta?.code === 200 ||
              res?.data?.code === 200
            ) {
              return (
                res?.data?.meta?.message ||
                res?.data?.message ||
                "Bet Placed successfully"
              );
            }
            else if (res?.data && (res?.status === 200 || res?.status === 201)) {
              return "Bet Placed successfully";
            }
            return null;
          },
          getErrorMessage: (err) => {
            return (
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              err?.message ||
              "Failed to place bet"
            );
          },
          successDuration: 4000,
        }
      )
    );

    const isSuccess = response?.data?.success === true || 
                     response?.data?.meta?.code === 200 || 
                     response?.data?.code === 200 ||
                     (response?.status >= 200 && response?.status < 300) ||
                     (response?.data && response?.status === 200);

    if (isSuccess) {
      const responseData = response.data?.data || response.data;
      
      yield new Promise(resolve => setTimeout(resolve, 500));
      
      const userResponse = yield call(API.get, "/users/profile");
      
      if (userResponse?.data?.success === true || 
          userResponse?.data?.meta?.code === 200 || 
          userResponse?.data?.code === 200 ||
          (userResponse?.status >= 200 && userResponse?.status < 300)) {
        
        const updatedUserData = userResponse.data?.data || userResponse.data;
        
        yield put(updateUserBalanceExposureSuccess({
          balance: updatedUserData?.balance,
          exposure: updatedUserData?.exposure,
        }));
        
        yield put(getUserDataSuccess(updatedUserData));
        
        yield call(setLocalStorageItem, "userData", JSON.stringify(updatedUserData));
      } else {
        yield put(updateUserBalanceExposureSuccess({
          balance: action.payload.balance,
          exposure: action.payload.exposure,
        }));
        
        const updatedUserData = {
          ...userData,
          balance: action.payload.balance,
          exposure: action.payload.exposure,
        };
        yield call(setLocalStorageItem, "userData", JSON.stringify(updatedUserData));
      }
    } else {
      yield put(updateUserBalanceExposureFailure());
    }
  } catch (error) {
    yield put(updateUserBalanceExposureFailure());
  }
}

export function* watchUpdateUserBalanceExposureAPI() {
  yield takeEvery(UPDATE_USER_BALANCE_EXPOSURE, updateUserBalanceExposureRequest);
}

export default function* rootSaga() {
  yield all([watchUpdateUserBalanceExposureAPI()]);
}