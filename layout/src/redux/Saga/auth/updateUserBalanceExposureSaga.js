import { all, call, put, takeEvery } from "redux-saga/effects";
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
    console.log("updateUserBalanceExposureRequest called with action:", action);
    // Get user data from localStorage
    const userData = getLocalStorageItem("userData");
    console.log("Current userData from localStorage:", userData);
    const userId = userData?._id;
    
    if (!userId) {
      console.error("User ID not found in localStorage");
      yield put(updateUserBalanceExposureFailure());
      return;
    }

    // Prepare payload with required fields
    // Send the stake amount for this individual bet, not the cumulative exposure
    const payload = {
      eventId: action.payload.eventId || null, // Use eventId instead of marketId
      marketId: action.payload.marketId || null, // Keep marketId for backward compatibility
      userId: userId,
      is_clear: action.payload.is_clear || "false",
      marketType: action.payload.marketType,
      exposure: action.payload.stake || action.payload.exposure, // Use stake if available, fallback to exposure
    };
    console.log("Sending payload to /exposures/update-exposure:", payload);
    
    // Make POST request to update exposure
    const response = yield call(() =>
      notifyPromise(
        () => API.post("/exposures/update-exposure", payload),
        {
          loadingText: "Updating exposure...",
          getSuccessMessage: (res) => {
    
            
            // Check for different success response formats
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
            // If we have a response with data but no explicit success field, assume success
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



    // More flexible response checking
    const isSuccess = response?.data?.success === true || 
                     response?.data?.meta?.code === 200 || 
                     response?.data?.code === 200 ||
                     (response?.status >= 200 && response?.status < 300) ||
                     (response?.data && response?.status === 200);

    console.log("Is success:", isSuccess);

    if (isSuccess) {
  
      
      // Extract data based on response structure
      const responseData = response.data?.data || response.data;
      console.log("Response data:", responseData);
      
      // Add a small delay to ensure the server has processed the exposure update
      console.log("Waiting 500ms before fetching updated user data");
      yield new Promise(resolve => setTimeout(resolve, 500));
      
      // Instead of just dispatching success action, let's fetch the updated user data
      // Make a GET request to fetch updated user data
      console.log("Fetching updated user data");
      const userResponse = yield call(API.get, "/users/profile");
      console.log("User data response:", userResponse);
      
      if (userResponse?.data?.success === true || 
          userResponse?.data?.meta?.code === 200 || 
          userResponse?.data?.code === 200 ||
          (userResponse?.status >= 200 && userResponse?.status < 300)) {
        
        const updatedUserData = userResponse.data?.data || userResponse.data;
        console.log("Updated user data:", updatedUserData);
        
        // Dispatch both actions to update both reducers
        yield put(updateUserBalanceExposureSuccess({
          balance: updatedUserData?.balance,
          exposure: updatedUserData?.exposure,
        }));
        
        yield put(getUserDataSuccess(updatedUserData));
        
        // Update localStorage with new user data
        console.log("Updating localStorage with updatedUserData:", updatedUserData);
        yield call(setLocalStorageItem, "userData", JSON.stringify(updatedUserData));
      } else {
        // Fallback to original approach if user data fetch fails
        console.log("Failed to fetch updated user data, using original values");
        yield put(updateUserBalanceExposureSuccess({
          balance: action.payload.balance,
          exposure: action.payload.exposure,
        }));
        
        // Update localStorage with the calculated values
        const updatedUserData = {
          ...userData,
          balance: action.payload.balance,
          exposure: action.payload.exposure,
        };
        console.log("Updating localStorage with calculated values:", updatedUserData);
        yield call(setLocalStorageItem, "userData", JSON.stringify(updatedUserData));
      }
    } else {
      console.log("Exposure update failed - unexpected response format");
      console.log("Response received:", response);
      // Dispatch failure action
      yield put(updateUserBalanceExposureFailure());
    }
  } catch (error) {
    console.error("Error updating exposure:", error);
    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    // Dispatch failure action
    yield put(updateUserBalanceExposureFailure());
  }
}

export function* watchUpdateUserBalanceExposureAPI() {
  yield takeEvery(UPDATE_USER_BALANCE_EXPOSURE, updateUserBalanceExposureRequest);
}

export default function* rootSaga() {
  yield all([watchUpdateUserBalanceExposureAPI()]);
}