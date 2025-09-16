import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Events.css';

const Events = () => {
  return (
    <div className="events-page">
      <div className="page-header">
        <h1>Events Management</h1>
        <p>Manage sports events and competitions</p>
      </div>
      
      <div className="page-actions">
        <Button variant="primary">Create New Event</Button>
      </div>
      
      <div className="events-grid">
        <Card>
          <div className="event-card">
            <h3>Premier League Match</h3>
            <p>Manchester United vs Liverpool</p>
            <p>Date: 2023-10-15 | Time: 15:00 UTC</p>
            <div className="event-actions">
              <Button variant="secondary" size="small">Edit</Button>
              <Button variant="error" size="small">Delete</Button>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="event-card">
            <h3>NBA Game</h3>
            <p>Lakers vs Celtics</p>
            <p>Date: 2023-10-16 | Time: 20:00 UTC</p>
            <div className="event-actions">
              <Button variant="secondary" size="small">Edit</Button>
              <Button variant="error" size="small">Delete</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Events;