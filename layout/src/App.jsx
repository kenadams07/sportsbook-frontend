import React from 'react';
import AppRouter from './routes/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import NotificationProvider from './components/Notify/NotificationProvider';

export default function LayoutApp() {
  return <div className='w-full'>
    <NotificationProvider>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
    </NotificationProvider>
  </div>;
}
