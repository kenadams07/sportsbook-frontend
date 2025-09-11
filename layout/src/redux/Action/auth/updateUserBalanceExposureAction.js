import { 
  UPDATE_USER_BALANCE_EXPOSURE,
  UPDATE_USER_BALANCE_EXPOSURE_SUCCESS,
  UPDATE_USER_BALANCE_EXPOSURE_FAILURE
} from "../actionTypes";

export const updateUserBalanceExposure = (payload) => ({
  type: UPDATE_USER_BALANCE_EXPOSURE,
  payload,
});

export const updateUserBalanceExposureSuccess = (payload) => ({
  type: UPDATE_USER_BALANCE_EXPOSURE_SUCCESS,
  payload,
});

export const updateUserBalanceExposureFailure = () => ({
  type: UPDATE_USER_BALANCE_EXPOSURE_FAILURE,
});