import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'SportsBook Admin',
    timeZone: 'UTC',
    currency: 'USD',
    notifications: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings saved:', settings);
    // In a real app, you would save these settings to a backend
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>System Settings</h1>
        <p>Configure application preferences</p>
      </div>
      
      <div className="settings-form">
        <Card>
          <form onSubmit={handleSubmit}>
            <Input
              label="Site Name"
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
            />
            
            <Input
              label="Time Zone"
              type="select"
              name="timeZone"
              value={settings.timeZone}
              onChange={handleChange}
              options={[
                { value: 'UTC', label: 'UTC' },
                { value: 'EST', label: 'Eastern Time' },
                { value: 'PST', label: 'Pacific Time' },
                { value: 'GMT', label: 'GMT' }
              ]}
            />
            
            <Input
              label="Currency"
              type="select"
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              options={[
                { value: 'USD', label: 'US Dollar' },
                { value: 'EUR', label: 'Euro' },
                { value: 'GBP', label: 'British Pound' }
              ]}
            />
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleChange}
                />
                Enable Notifications
              </label>
            </div>
            
            <Button type="submit" variant="primary">Save Settings</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;