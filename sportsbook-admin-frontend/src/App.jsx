import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AppRoutes from './routes/AppRoutes';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <Layout>
              <AppRoutes />
            </Layout>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;