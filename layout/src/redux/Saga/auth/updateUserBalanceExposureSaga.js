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
import { unwrapApiResponse } from "../../../utils/apiResponse";
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
import { fetchUserBetsSuccess } from "../../Action/userBetsActions";
import { fetchUserBets as fetchUserBetsAPI } from "../../../utils/userBetsApi";

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

    const placeBetResult = unwrapApiResponse(response);
      
      yield new Promise(resolve => setTimeout(resolve, 500));
      
      const userResponse = yield call(API.get, "/users/profile");
      const userResult = unwrapApiResponse(userResponse);
      const updatedUserData = userResult.data;
      
        yield put(updateUserBalanceExposureSuccess({
          balance: updatedUserData?.balance,
          exposure: updatedUserData?.exposure,
        }));
        
        yield put(getUserDataSuccess(updatedUserData));

        const savedBetEventId = placeBetResult?.data?.bet?.eventId || payload.eventId;
        if (savedBetEventId) {
          const latestBets = yield call(fetchUserBetsAPI, userId, savedBetEventId);
          yield put(fetchUserBetsSuccess(Array.isArray(latestBets) ? latestBets : []));
        }
        
        yield call(setLocalStorageItem, "userData", JSON.stringify(updatedUserData));
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
