import React from 'react';
import ReactDOM from 'react-dom/client';
import LayoutApp from './App';
import "./index.css";
import { Provider as ReduxStore } from "react-redux";
import { store,persistor } from './redux/Store';
import { PersistGate } from "redux-persist/integration/react";
ReactDOM.createRoot(document.getElementById('root')).render(
  <ReduxStore store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <LayoutApp />
    </PersistGate>
  </ReduxStore>


);
