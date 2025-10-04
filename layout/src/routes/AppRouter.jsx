import React, { Suspense, lazy, useMemo } from 'react'
import MyErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Paths } from './path'
import { domainConfig } from '../utils/getDomainConfig';
import Loader from '../components/Loader/Loader';
import Casino from '../pages/Casino';
import CasinoTournaments from '../pages/CasinoTournaments';
import MainLiveSection from '../components/Live-section/MainLiveSection';
import LeftSidebarEventView from '../components/Live-section/LeftSidebarEventView';
import LiveCalender from '../components/Live-section/LiveCalender';
import Results from '../components/Live-section/Results';
import VerifyEmail from '../pages/VerifyEmail';
import ResetPassword from '../pages/ResetPassword';
import Games from '../components/Games';
import MainEsportsSection from '../components/Esports-section/MainEsportsSection';
import EsportsCalendar from '../components/Esports-section/EsportsCalendar';
import EsportsResults from '../components/Esports-section/EsportsResults';
import EsportsStatistics from '../components/Esports-section/EsportsStatistics';
import VirtualSports from '../pages/VirtualSports';

const Homepage = lazy(() => import('../pages/Homepage'));
const NotFound = lazy(() => import('../components/Error/NotFound'));

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
            <Route path={Paths.casinoTournaments} element={<CasinoTournaments />} />
            <Route path={Paths.eventView} element={<MainLiveSection />} />
            <Route path={Paths.liveCalendar} element={<LiveCalender />} />
            <Route path={Paths.results} element={<Results />} />
            <Route path={Paths.statistics} element={<Statistics />} />
            <Route path={Paths.games} element={<Games />} />
            <Route path={Paths.esportsEventView} element={<MainEsportsSection />} />
            <Route path={Paths.esportsLiveCalendar} element={<EsportsCalendar />} />
            <Route path={Paths.esportsResults} element={<EsportsResults />} />
            <Route path={Paths.esportsStatistics} element={<EsportsStatistics />} />
            <Route path={Paths.virtualSports} element={<VirtualSports />} />
          </Route>
          <Route path={Paths.verifyEmail} element={<VerifyEmail />} />
          <Route path={Paths.resetPassword} element={<ResetPassword />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </MyErrorBoundary> 
  )
}

export default AppRouter