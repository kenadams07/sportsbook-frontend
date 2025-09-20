# Redux Implementation Documentation

## Overview
This document describes the Redux implementation in the Sportsbook Admin Frontend application. Redux is used for state management across the application, following a feature-based organization pattern with Redux-Saga for side effects.

## Architecture

### Store Structure
The Redux store is organized with a clear separation of concerns:
- `src/redux/actions/` - Action creators for all features
- `src/redux/actiontypes/` - Action type constants
- `src/redux/reducers/` - Reducer functions for all features
- `src/redux/sagas/` - Saga middleware for handling side effects
- `src/redux/store/` - Store configuration

### Current Features
1. `create-event` - Manages event creation functionality
2. `competitions` - Manages competitions data fetching
3. `sports` - Manages sports data fetching
4. `events` - Manages events data fetching

## Feature: Create Event

### State Structure
```javascript
{
  events: [],        // Array of created events
  loading: false,    // Loading state for API calls
  error: null,       // Error message if API call fails
  success: false     // Success state after event creation
}
```

### Actions
- `createEventRequest` - Action to initiate event creation
- `createEventSuccess` - Action dispatched on successful event creation
- `createEventFailure` - Action dispatched on event creation failure
- `clearCreateEventState` - Action to reset the state
- `resetCreateEventSuccess` - Action to reset success state

## Feature: Competitions

### State Structure
```javascript
{
  competitions: [],  // Array of competitions
  eventsData: [],    // Full events data for filtering
  loading: false,    // Loading state for API calls
  error: null        // Error message if API call fails
}
```

### Actions
- `fetchCompetitionsRequest` - Action to initiate competitions fetching
- `fetchCompetitionsSuccess` - Action dispatched on successful competitions fetching
- `fetchCompetitionsFailure` - Action dispatched on competitions fetching failure
- `clearCompetitionsState` - Action to reset the state

## Feature: Sports

### State Structure
```javascript
{
  sports: [],        // Array of sports
  loading: false,    // Loading state for API calls
  error: null        // Error message if API call fails
}
```

### Actions
- `fetchAllSportsRequest` - Action to initiate sports fetching
- `fetchAllSportsSuccess` - Action dispatched on successful sports fetching
- `fetchAllSportsFailure` - Action dispatched on sports fetching failure
- `clearSportsState` - Action to reset the state

## Feature: Events

### State Structure
```javascript
{
  events: [],        // Array of events
  loading: false,    // Loading state for API calls
  error: null        // Error message if API call fails
}
```

### Actions
- `fetchEventsRequest` - Action to initiate events fetching
- `fetchEventsSuccess` - Action dispatched on successful events fetching
- `fetchEventsFailure` - Action dispatched on events fetching failure
- `clearEventsState` - Action to reset the state

## Implementation Patterns

### 1. Directory Structure
```
src/
└── redux/
    ├── actions/
    │   ├── createEventActions.js
    │   ├── competitionsActions.js
    │   ├── sportsActions.js
    │   └── eventsActions.js
    ├── actiontypes/
    │   ├── createEventTypes.js
    │   ├── competitionsTypes.js
    │   ├── sportsTypes.js
    │   └── eventsTypes.js
    ├── reducers/
    │   ├── createEventReducer.js
    │   ├── competitionsReducer.js
    │   ├── sportsReducer.js
    │   └── eventsReducer.js
    ├── sagas/
    │   ├── createEventSaga.js
    │   ├── competitionsSaga.js
    │   ├── sportsSaga.js
    │   ├── eventsSaga.js
    │   └── rootSaga.js
    ├── store/
    │   └── index.js
    └── index.js
```

### 2. Action Types
Action types are defined as constants to prevent typos and make refactoring easier:
```javascript
// createEventTypes.js
export const CREATE_EVENT_REQUEST = 'createEvent/CREATE_EVENT_REQUEST';
export const CREATE_EVENT_SUCCESS = 'createEvent/CREATE_EVENT_SUCCESS';
export const CREATE_EVENT_FAILURE = 'createEvent/CREATE_EVENT_FAILURE';
export const CLEAR_CREATE_EVENT_STATE = 'createEvent/CLEAR_CREATE_EVENT_STATE';
export const RESET_CREATE_EVENT_SUCCESS = 'createEvent/RESET_CREATE_EVENT_SUCCESS';
```

### 3. Reducers
Reducers follow a consistent pattern with clear state transitions:
```javascript
const createEventReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_EVENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    // ... other cases
    default:
      return state;
  }
};
```

### 4. Actions
Action creators are simple functions that return action objects:
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

### 5. Sagas
Sagas handle side effects using generator functions:
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

## Best Practices

1. **Feature-based organization** - Each feature has its own Redux components
2. **Consistent naming** - Action types follow the pattern `feature/ACTION_TYPE`
3. **Error handling** - All sagas handle errors gracefully
4. **Loading states** - Proper loading indicators for better UX
5. **Separation of concerns** - Reducers only handle state transitions, sagas handle side effects
6. **Immutability** - State is never mutated directly
7. **Declarative side effects** - Using Redux-Saga effects for explicit side effect handling
8. **Testability** - Sagas and reducers are easily testable

## Testing

### Reducer Tests
Reducers are tested for all possible state transitions:
```javascript
it('should handle CREATE_EVENT_REQUEST', () => {
  const action = { type: CREATE_EVENT_REQUEST };
  const expectedState = { ...initialState, loading: true };
  expect(createEventReducer(initialState, action)).toEqual(expectedState);
});
```

### Saga Tests
Sagas are tested using Redux-Saga's test utilities:
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

## Integration

### Store Configuration
The store is configured in `src/redux/store/index.js`:
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

### Component Usage
Components use Redux with the useSelector and useDispatch hooks:
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { createEventRequest } from '../redux/actions/createEventActions';

const Component = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector(state => state.createEvent);
  
  const handleCreate = (eventData) => {
    dispatch(createEventRequest(eventData));
  };
  
  // ... rest of component
};
```