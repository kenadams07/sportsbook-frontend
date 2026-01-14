import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import Bets from '../pages/Bets';
import Login from '../pages/Login';

// Import new components
import { ExchangeMarket } from '../pages/Markets/index';
import { AddUser, UserList, InactiveUsers } from '../pages/Users/index'; // Note: Check if we need to remove old Users page import if it conflicts
import { AddWhitelabel, WhitelabelList, InactiveWhitelabelList } from '../pages/Whitelabel/index';
import { AddManager, ManagerList, AccountManagers, OperationalManagers, MonitoringManagers } from '../pages/Managers/index';
import { GeneralReports, ReportAnalysis, CasinoReportAnalysis, CommissionReport } from '../pages/Reports/index'; // Replaces old Reports import
import { AddCurrency, CurrencyList } from '../pages/Currency/index';
import { RestorePanel } from '../pages/Restore/index';
import { ResultsPage } from '../pages/Results/index';
import { SportsSettings, LeagueSettings, MatchSettings, CommissionSettings } from '../pages/Settings/index'; // Replaces old Settings import
import { ChangeIdPage } from '../pages/ChangeId/index';
import { NotificationsPage } from '../pages/Notifications/index';
import { BonusPage } from '../pages/Bonus/index';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Markets */}
      <Route path="/markets/exchange" element={<ExchangeMarket />} />
      
      {/* Users */}
      <Route path="/users/add" element={<AddUser />} />
      <Route path="/users/list" element={<UserList />} />
      <Route path="/users/inactive" element={<InactiveUsers />} />
      
      {/* Whitelabel */}
      <Route path="/whitelabel/add" element={<AddWhitelabel />} />
      <Route path="/whitelabel/list" element={<WhitelabelList />} />
      <Route path="/whitelabel/inactive" element={<InactiveWhitelabelList />} />
      
      {/* Managers */}
      <Route path="/managers/add" element={<AddManager />} />
      <Route path="/managers/list" element={<ManagerList />} />
      <Route path="/managers/account" element={<AccountManagers />} />
      <Route path="/managers/operational" element={<OperationalManagers />} />
      <Route path="/managers/monitoring" element={<MonitoringManagers />} />
      
      {/* Reports */}
      <Route path="/reports/general" element={<GeneralReports />} />
      <Route path="/reports/analysis" element={<ReportAnalysis />} />
      <Route path="/reports/casino-analysis" element={<CasinoReportAnalysis />} />
      <Route path="/reports/commission" element={<CommissionReport />} />
      
      {/* Currency */}
      <Route path="/currency/add" element={<AddCurrency />} />
      <Route path="/currency/list" element={<CurrencyList />} />
      
      {/* Other Pages */}
      <Route path="/restore" element={<RestorePanel />} />
      <Route path="/events" element={<Events />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/change-id" element={<ChangeIdPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/bonus" element={<BonusPage />} />
      
      {/* Settings */}
      <Route path="/settings/sports" element={<SportsSettings />} />
      <Route path="/settings/leagues" element={<LeagueSettings />} />
      <Route path="/settings/matches" element={<MatchSettings />} />
      <Route path="/settings/commission" element={<CommissionSettings />} />
      
      {/* Legacy/Fallback Routes - Redirect to new lists or keep if needed */}
      <Route path="/users" element={<Navigate to="/users/list" replace />} />
      <Route path="/reports" element={<Navigate to="/reports/general" replace />} />
      <Route path="/settings" element={<Navigate to="/settings/sports" replace />} />
      <Route path="/bets" element={<Bets />} /> {/* Kept as it was in original but not in new sidebar */}
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;