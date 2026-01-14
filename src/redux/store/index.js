import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas/rootSaga.js';

// Import reducers from the new location
import createEventReducer from '../reducers/createEventReducer.js';
import competitionsReducer from '../reducers/competitionsReducer.js';
import sportsReducer from '../reducers/sportsReducer.js';
import eventsReducer from '../reducers/eventsReducer.js';

// Root reducer
const rootReducer = combineReducers({
  createEvent: createEventReducer,
  competitions: competitionsReducer,
  sports: sportsReducer,
  events: eventsReducer,
});

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