import React, { Suspense, lazy, useMemo } from 'react'
import MyErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Paths } from './path'
import { domainConfig } from '../utils/getDomainConfig';
import Loader from '../components/Loader/Loader';
import Casino from '../pages/Casino';

const Homepage = lazy(() => import('../pages/Homepage'));
const NotFound = lazy(() => import('../components/Error/NotFound'));

const AppRouter = () => {
  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5002';
  const config = domainConfig[currentDomain] || domainConfig['http://localhost:5002'];
  
  const Layout = useMemo(() => {
    return lazy(() => import(`../layouts/${config.layout}/Layout.jsx`));
  }, [config.layout]);
  
  return (
    <MyErrorBoundary>
      <Suspense fallback={<div>
        <Loader />
      </div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to={Paths.home} replace={true} />} />
            <Route path={Paths.home} element={<Homepage />} />
            <Route path={Paths.casino} element={<Casino />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </MyErrorBoundary> 
  )
}

export default AppRouter