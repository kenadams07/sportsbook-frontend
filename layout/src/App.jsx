import React from 'react';
import AppRouter from './routes/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import NotificationProvider from './components/Notify/NotificationProvider';
import NetworkStatusIndicator from './components/NetworkStatusIndicator';
import ServerStatusChecker from './components/ServerStatusChecker';

export default function LayoutApp() {
  return <div className='w-full'>
    <NotificationProvider>
    <BrowserRouter>
      <AppRouter />
      <NetworkStatusIndicator />
      <ServerStatusChecker />
    </BrowserRouter>
    </NotificationProvider>
  </div>;
}