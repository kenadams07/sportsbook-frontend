import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stats-grid">
          <Card variant="primary">
            <div className="stat-card">
              <h3>Active Events</h3>
              <p className="stat-value">24</p>
              <p className="stat-description">+2 from yesterday</p>
            </div>
          </Card>
          
          <Card variant="success">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-value">1,248</p>
              <p className="stat-description">+12% from last month</p>
            </div>
          </Card>
          
          <Card variant="warning">
            <div className="stat-card">
              <h3>Today's Bets</h3>
              <p className="stat-value">12,489</p>
              <p className="stat-description">+5% from yesterday</p>
            </div>
          </Card>
          
          <Card variant="error">
            <div className="stat-card">
              <h3>Pending Issues</h3>
              <p className="stat-value">3</p>
              <p className="stat-description">Requires attention</p>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <Button variant="primary" size="large">
          Create New Event
        </Button>
        <Button variant="secondary" size="large">
          View All Reports
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;