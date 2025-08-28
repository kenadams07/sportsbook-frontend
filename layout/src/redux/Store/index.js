import createSagaMiddleware from "redux-saga";
import rootReducer from "../Reducer/index";
import rootSaga from "../Saga/index";
import { configureStore } from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { VERIFY_EMAIL } from "../Action/actionTypes";

const sagaMiddleware = createSagaMiddleware();

// Configure persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: [], // add names of reducers you want to persist, e.g. ['auth']
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these redux-persist action types in serializable check
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, VERIFY_EMAIL],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

// Create persistor
const persistor = persistStore(store);

export { store, persistor };