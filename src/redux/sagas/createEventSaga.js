import { all, call, put, takeEvery } from "redux-saga/effects";
import { api } from "../../services/api";
import {
  createEventSuccess,
  createEventFailure
} from "../actions/createEventActions";
import { CREATE_EVENT_REQUEST } from "../actiontypes/createEventTypes";

function* createEventRequestSaga(action) {
  try {
    console.log("createEventRequestSaga called with action:", action);
    const response = yield call(api.createEvent, action.payload);
    console.log("createEvent response:", response);
    
    console.log("createEvent success with data:", response);
    yield put(createEventSuccess(response));
  } catch (error) {
    console.error("Error in createEventRequestSaga:", error);
    yield put(createEventFailure(error.message || "Failed to create event"));
  }
}

export function* watchCreateEventAPI() {
  yield takeEvery(CREATE_EVENT_REQUEST, createEventRequestSaga);
}

export default function* createEventRootSaga() {
  yield all([watchCreateEventAPI()]);
}