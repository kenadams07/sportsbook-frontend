import { all } from "redux-saga/effects";
import sportsRootSaga from "./sportsSaga.js";
import eventsRootSaga from "./eventsSaga.js";
import competitionsRootSaga from "./competitionsSaga.js";
import createEventRootSaga from "./createEventSaga.js";

export default function* rootSaga() {
  yield all([
    sportsRootSaga(),
    eventsRootSaga(),
    competitionsRootSaga(),
    createEventRootSaga(),
  ]);
}