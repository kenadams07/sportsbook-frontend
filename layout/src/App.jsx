import React from 'react';
import AppRouter from './routes/AppRouter';
import { BrowserRouter } from 'react-router-dom';

export default function LayoutApp() {
  return <div className='w-full'>
<BrowserRouter>
    <AppRouter />
</BrowserRouter>
  </div>;
}
