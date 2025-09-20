import { all, call, put, takeEvery } from "redux-saga/effects";
import { api } from "../../services/api";
import {
  fetchEventsSuccess,
  fetchEventsFailure
} from "../actions/eventsActions";
import { FETCH_EVENTS_REQUEST } from "../actiontypes/eventsTypes";

function* fetchEventsRequestSaga() {
  try {
    console.log("fetchEventsRequestSaga called");
    const response = yield call(api.getEvents);
    console.log("fetchEvents response:", response);
    
    console.log("fetchEvents success with data:", response);
    yield put(fetchEventsSuccess(response));
  } catch (error) {
    console.error("Error in fetchEventsRequestSaga:", error);
    yield put(fetchEventsFailure(error.message || "Failed to fetch events"));
  }
}

export function* watchFetchEventsAPI() {
  yield takeEvery(FETCH_EVENTS_REQUEST, fetchEventsRequestSaga);
}

export default function* eventsRootSaga() {
  yield all([watchFetchEventsAPI()]);
}