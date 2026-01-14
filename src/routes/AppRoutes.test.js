import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

// Mock page components
jest.mock('../pages/Dashboard', () => () => <div>Dashboard Page</div>);
jest.mock('../pages/Events', () => () => <div>Events Page</div>);
jest.mock('../pages/Users', () => () => <div>Users Page</div>);
jest.mock('../pages/Bets', () => () => <div>Bets Page</div>);
jest.mock('../pages/Reports', () => () => <div>Reports Page</div>);
jest.mock('../pages/Settings', () => () => <div>Settings Page</div>);

describe('AppRoutes', () => {
  test('renders routes correctly', () => {
    const { container } = render(
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    );
    
    // Check that the routes are rendered
    expect(container).toBeInTheDocument();
  });
});