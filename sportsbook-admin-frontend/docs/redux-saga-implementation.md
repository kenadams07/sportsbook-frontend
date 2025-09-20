# Redux-Saga Implementation Documentation

## Overview
This document describes the Redux-Saga implementation in the Sportsbook Admin Frontend application. Redux-Saga is used for handling side effects in the application, such as API calls, with a more structured and testable approach compared to Redux Toolkit's async thunks.

## Architecture

### Directory Structure
The Redux implementation follows a feature-based organization pattern with the following directory structure:

```
src/
└── redux/
    ├── actions/          # Action creators
    ├── actiontypes/      # Action type constants
    ├── reducers/         # Reducers
    ├── sagas/            # Saga middleware for side effects
    └── store/            # Store configuration
```

### Store Configuration
The store is configured in `src/redux/store/index.js` with Redux-Saga middleware:

```javascript
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

// Import reducers
import createEventReducer from '../reducers/createEventReducer';
import competitionsReducer from '../reducers/competitionsReducer';
import sportsReducer from '../reducers/sportsReducer';
import eventsReducer from '../reducers/eventsReducer';

// Import root sagas
import createEventRootSaga from '../sagas/createEventSaga';
import competitionsRootSaga from '../sagas/competitionsSaga';
import sportsRootSaga from '../sagas/sportsSaga';
import eventsRootSaga from '../sagas/eventsSaga';

// Root reducer
const rootReducer = combineReducers({
  createEvent: createEventReducer,
  competitions: competitionsReducer,
  sports: sportsReducer,
  events: eventsReducer,
});

// Root saga
function* rootSaga() {
  yield all([
    createEventRootSaga(),
    competitionsRootSaga(),
    sportsRootSaga(),
    eventsRootSaga(),
  ]);
}

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create store
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);

// Run root saga
sagaMiddleware.run(rootSaga);

export default store;
```

## Features

### 1. Create Event Feature

#### Action Types
Defined in `src/redux/actiontypes/createEventTypes.js`:
```javascript
export const CREATE_EVENT_REQUEST = 'createEvent/CREATE_EVENT_REQUEST';
export const CREATE_EVENT_SUCCESS = 'createEvent/CREATE_EVENT_SUCCESS';
export const CREATE_EVENT_FAILURE = 'createEvent/CREATE_EVENT_FAILURE';
export const CLEAR_CREATE_EVENT_STATE = 'createEvent/CLEAR_CREATE_EVENT_STATE';
export const RESET_CREATE_EVENT_SUCCESS = 'createEvent/RESET_CREATE_EVENT_SUCCESS';
```

#### Actions
Defined in `src/redux/actions/createEventActions.js`:
```javascript
export const createEventRequest = (eventData) => ({
  type: CREATE_EVENT_REQUEST,
  payload: eventData
});

export const createEventSuccess = (event) => ({
  type: CREATE_EVENT_SUCCESS,
  payload: event
});

export const createEventFailure = (error) => ({
  type: CREATE_EVENT_FAILURE,
  payload: error
});
```

#### Saga
Defined in `src/redux/sagas/createEventSaga.js`:
```javascript
import { all, call, put, takeEvery } from "redux-saga/effects";
import { api } from "../../services/api";
import {
  createEventSuccess,
  createEventFailure
} from "../actions/createEventActions";
import { CREATE_EVENT_REQUEST } from "../actiontypes/createEventTypes";

function* createEventRequestSaga(action) {
  try {
    const response = yield call(api.createEvent, action.payload);
    yield put(createEventSuccess(response));
  } catch (error) {
    yield put(createEventFailure(error.message || "Failed to create event"));
  }
}

export function* watchCreateEventAPI() {
  yield takeEvery(CREATE_EVENT_REQUEST, createEventRequestSaga);
}

export default function* createEventRootSaga() {
  yield all([watchCreateEventAPI()]);
}
```

### 2. Competitions Feature

#### Action Types
Defined in `src/redux/actiontypes/competitionsTypes.js`:
```javascript
export const FETCH_COMPETITIONS_REQUEST = 'competitions/FETCH_COMPETITIONS_REQUEST';
export const FETCH_COMPETITIONS_SUCCESS = 'competitions/FETCH_COMPETITIONS_SUCCESS';
export const FETCH_COMPETITIONS_FAILURE = 'competitions/FETCH_COMPETITIONS_FAILURE';
export const CLEAR_COMPETITIONS_STATE = 'competitions/CLEAR_COMPETITIONS_STATE';
```

#### Actions
Defined in `src/redux/actions/competitionsActions.js`:
```javascript
export const fetchCompetitionsRequest = (sportId) => ({
  type: FETCH_COMPETITIONS_REQUEST,
  payload: sportId
});

export const fetchCompetitionsSuccess = (competitions) => ({
  type: FETCH_COMPETITIONS_SUCCESS,
  payload: competitions
});
```

#### Saga
Defined in `src/redux/sagas/competitionsSaga.js`:
```javascript
import { all, call, put, takeEvery } from "redux-saga/effects";
import { api } from "../../services/api";
import {
  fetchCompetitionsSuccess,
  fetchCompetitionsFailure
} from "../actions/competitionsActions";
import { FETCH_COMPETITIONS_REQUEST } from "../actiontypes/competitionsTypes";

function* fetchCompetitionsRequestSaga(action) {
  try {
    const response = yield call(api.getCompetitions, action.payload);
    // Process response and extract competitions
    yield put(fetchCompetitionsSuccess(processedResponse));
  } catch (error) {
    yield put(fetchCompetitionsFailure(error.message || "Failed to fetch competitions"));
  }
}

export function* watchFetchCompetitionsAPI() {
  yield takeEvery(FETCH_COMPETITIONS_REQUEST, fetchCompetitionsRequestSaga);
}

export default function* competitionsRootSaga() {
  yield all([watchFetchCompetitionsAPI()]);
}
```

## Implementation Patterns

### 1. Action Flow
1. Component dispatches a request action (e.g., `createEventRequest`)
2. Saga intercepts the action and performs the side effect (API call)
3. Saga dispatches either a success or failure action based on the result
4. Reducer updates the state based on the action type

### 2. Saga Structure
Each feature has its own saga file with:
- Worker sagas that perform the actual side effects
- Watcher sagas that listen for specific actions
- Root saga that combines all feature sagas

### 3. Error Handling
All sagas include proper error handling:
```javascript
function* workerSaga(action) {
  try {
    const response = yield call(api.function, action.payload);
    yield put(successAction(response));
  } catch (error) {
    yield put(failureAction(error.message));
  }
}
```

## Best Practices

1. **Separation of Concerns** - Actions, reducers, and sagas have distinct responsibilities
2. **Testability** - Sagas are easier to test than async thunks
3. **Scalability** - Feature-based organization makes it easy to add new features
4. **Declarative Side Effects** - Using `call`, `put`, `takeLatest` makes side effects explicit
5. **Cancellation** - Redux-Saga provides built-in support for cancelling ongoing requests
6. **Complex Flows** - Sagas handle complex asynchronous flows better than thunks

## Testing

### Saga Testing
Sagas can be tested using Redux-Saga's test utilities:

```javascript
import { call, put } from 'redux-saga/effects';
import { createEventRequestSaga } from './createEventSaga';
import { createEventSuccess, createEventFailure } from '../actions/createEventActions';

describe('createEventRequestSaga', () => {
  const action = { type: 'createEvent/CREATE_EVENT_REQUEST', payload: { name: 'Test Event' } };
  
  it('should call api.createEvent and dispatch success', () => {
    const generator = createEventRequestSaga(action);
    const response = { id: 1, name: 'Test Event' };
    
    // Expect call to API
    expect(generator.next().value).toEqual(call(api.createEvent, action.payload));
    
    // Expect success action
    expect(generator.next(response).value).toEqual(put(createEventSuccess(response)));
  });
});
```

## Migration from Redux Toolkit

### Before (Redux Toolkit)
```javascript
export const createEvent = createAsyncThunk(
  'createEvent/CREATE_EVENT_REQUEST',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.createEvent(eventData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### After (Redux-Saga)
```javascript
// Action
export const createEventRequest = (eventData) => ({
  type: CREATE_EVENT_REQUEST,
  payload: eventData
});

// Saga
function* createEventRequestSaga(action) {
  try {
    const response = yield call(api.createEvent, action.payload);
    yield put(createEventSuccess(response));
  } catch (error) {
    yield put(createEventFailure(error.message));
  }
}
```

## Benefits of Redux-Saga

1. **Better Testability** - Sagas are generator functions that are easy to test
2. **Declarative Side Effects** - Explicit effect creation with `call`, `put`, etc.
3. **Cancellation Support** - Built-in support for cancelling ongoing requests
4. **Complex Flow Handling** - Better handling of complex asynchronous flows
5. **Race Conditions** - Built-in utilities for handling race conditions
6. **Debouncing/Throttling** - Built-in support for debouncing and throttling
7. **Better Debugging** - Sagas provide better debugging experience
8. **Consistent Pattern** - More consistent pattern across different types of side effects