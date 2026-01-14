import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Bets.css';

const Bets = () => {
  return (
    <div className="bets-page">
      <div className="page-header">
        <h1>Bet Management</h1>
        <p>Monitor and manage user bets</p>
      </div>
      
      <div className="bets-stats">
        <div className="stats-grid">
          <Card variant="primary">
            <div className="stat-card">
              <h3>Total Bets</h3>
              <p className="stat-value">12,489</p>
            </div>
          </Card>
          
          <Card variant="success">
            <div className="stat-card">
              <h3>Active Bets</h3>
              <p className="stat-value">3,245</p>
            </div>
          </Card>
          
          <Card variant="warning">
            <div className="stat-card">
              <h3>Pending Settlement</h3>
              <p className="stat-value">156</p>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="bets-table">
        <Card>
          <table className="data-table">
            <thead>
              <tr>
                <th>Bet ID</th>
                <th>User</th>
                <th>Event</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BET-001</td>
                <td>John Doe</td>
                <td>Man Utd vs Liverpool</td>
                <td>$50.00</td>
                <td>Active</td>
                <td>
                  <Button variant="secondary" size="small">View</Button>
                </td>
              </tr>
              <tr>
                <td>BET-002</td>
                <td>Jane Smith</td>
                <td>Lakers vs Celtics</td>
                <td>$100.00</td>
                <td>Settled</td>
                <td>
                  <Button variant="secondary" size="small">View</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default Bets;