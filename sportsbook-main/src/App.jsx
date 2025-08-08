import React, { Suspense } from 'react';

//const SportsbookApp = React.lazy(() => import('sportsbook/SportsbookApp'));
const LayoutApp = React.lazy(() => import('layout/LayoutApp'));

export default function App() {
  return (
    <div className=''>
      <h1>Sportsbook Frontend (Host)</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <LayoutApp />
        {/* <SportsbookApp /> */}
      </Suspense>
    </div>
  );
}
