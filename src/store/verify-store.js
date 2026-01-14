// Simple verification script for the Redux store
import { store } from './index';
import { createEvent } from './actions';

console.log('Initial state:', store.getState());

// Dispatch a test action
store.dispatch(createEvent({ name: 'Test Event' }));

console.log('State after dispatch:', store.getState());

console.log('Redux store verification complete');