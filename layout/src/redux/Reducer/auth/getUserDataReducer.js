import {
  GET_USER_DATA,
  GET_USER_DATA_SUCCESS,
  GET_USER_DATA_FAILURE,
} from "../../Action/actionTypes";

const INIT_STATE = {
  loading: false,
  userData: {},
  error: null,
};

const getUserDataReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USER_DATA:
      return { ...state, loading: true, error: null };
    case GET_USER_DATA_SUCCESS:
      return {
        ...state,
        userData: action?.payload,
        loading: false,
        error: null,
      };
    case GET_USER_DATA_FAILURE:
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
};

export default getUserDataReducer;