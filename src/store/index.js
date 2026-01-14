import { configureStore } from '@reduxjs/toolkit';
import { createEventReducer } from './features/create-event';
import { competitionsReducer } from './features/competitions';

export const store = configureStore({
  reducer: {
    createEvent: createEventReducer,
    competitions: competitionsReducer,
  },
});

export default store;