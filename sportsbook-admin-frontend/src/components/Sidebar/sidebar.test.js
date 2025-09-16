// Simple test to verify sidebar component renders correctly
import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';

// Mock useAuth hook
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    logout: jest.fn(),
  }),
}));

describe('Sidebar', () => {
  test('renders sidebar with menu items', () => {
    render(<Sidebar />);
    
    // Check if sidebar is rendered
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    
    // Check if menu items are rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Bets')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});