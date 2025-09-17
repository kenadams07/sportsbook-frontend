import {
  VERIFY_EMAIL,
  VERIFY_EMAIL_SUCCESS,
  VERIFY_EMAIL_FAILURE,
} from "../../Action/actionTypes";

const initialState = {
  loading: false,
  data: null,
  error: null,
  success: false,
};

const verifyEmailReducer = (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_EMAIL:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
        success: true,
      };
    case VERIFY_EMAIL_FAILURE:
      // Use the error message from the action payload if available
      const errorMessage = action.payload?.message || action.payload || "Verification failed";
      return {
        ...state,
        loading: false,
        data: action.payload?.data || null,
        error: errorMessage,
        success: false,
      };
    default:
      return state;
  }
};

export default verifyEmailReducer;