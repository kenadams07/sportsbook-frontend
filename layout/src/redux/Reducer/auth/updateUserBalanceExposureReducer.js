import {
  UPDATE_USER_BALANCE_EXPOSURE,
  UPDATE_USER_BALANCE_EXPOSURE_SUCCESS,
  UPDATE_USER_BALANCE_EXPOSURE_FAILURE
} from "../../Action/actionTypes";

const INIT_STATE = {
  loading: false,
  error: null,
};

const updateUserBalanceExposureReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_USER_BALANCE_EXPOSURE:
      return { ...state, loading: true, error: null };
    case UPDATE_USER_BALANCE_EXPOSURE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_USER_BALANCE_EXPOSURE_FAILURE:
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
};

export default updateUserBalanceExposureReducer;