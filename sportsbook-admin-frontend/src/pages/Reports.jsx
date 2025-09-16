import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Reports.css';

const Reports = () => {
  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <p>Financial and performance reports</p>
      </div>
      
      <div className="reports-grid">
        <Card>
          <div className="report-card">
            <h3>Financial Report</h3>
            <p>Revenue, profits, and expenses</p>
            <Button variant="secondary">View Report</Button>
          </div>
        </Card>
        
        <Card>
          <div className="report-card">
            <h3>User Activity</h3>
            <p>Login statistics and engagement</p>
            <Button variant="secondary">View Report</Button>
          </div>
        </Card>
        
        <Card>
          <div className="report-card">
            <h3>Bet Statistics</h3>
            <p>Betting patterns and trends</p>
            <Button variant="secondary">View Report</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;