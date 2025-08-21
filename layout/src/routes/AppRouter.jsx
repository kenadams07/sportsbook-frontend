import React, { Suspense, lazy, useMemo } from 'react'
import MyErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Paths } from './path'
import { domainConfig } from '../utils/getDomainConfig';
import Loader from '../components/Loader/Loader';
import Casino from '../pages/Casino';
import MainLiveSection from '../components/Live-section/MainLiveSection';
import LeftSidebarEventView from '../components/Live-section/LeftSidebarEventView';

const Homepage = lazy(() => import('../pages/Homepage'));
const NotFound = lazy(() => import('../components/Error/NotFound'));

const LiveCalendar = () => <div style={{color: 'white', padding: 24}}>Live Calendar Page</div>;
const Results = () => <div style={{color: 'white', padding: 24}}>Results Page</div>;
const Statistics = () => <div style={{color: 'white', padding: 24}}>Statistics Page</div>;

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
            <Route path={Paths.eventView} element={<MainLiveSection />} />
            <Route path={Paths.liveCalendar} element={<LiveCalendar />} />
            <Route path={Paths.results} element={<Results />} />
            <Route path={Paths.statistics} element={<Statistics />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </MyErrorBoundary> 
  )
}

export default AppRouter