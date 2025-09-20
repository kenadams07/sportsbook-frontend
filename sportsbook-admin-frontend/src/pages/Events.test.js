import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Events from './Events';
import * as api from '../services/api';

// Mock the API module
jest.mock('../services/api');

// Mock the child components
jest.mock('../components/SportsDropdown', () => {
  return function MockSportsDropdown(props) {
    return (
      <select 
        data-testid="sports-dropdown"
        onChange={(e) => props.onSportSelect({ sport_id: e.target.value, sport_name: `Sport ${e.target.value}` })}
        value={props.selectedSport?.sport_id || ''}
      >
        <option value="">Select a sport</option>
        <option value="1">Football</option>
        <option value="2">Basketball</option>
      </select>
    );
  };
});

describe('Events Page', () => {
  const mockSports = [
    { sport_id: '1', sport_name: 'Football' },
    { sport_id: '2', sport_name: 'Basketball' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders page title and description', () => {
    render(<Events />);
    
    expect(screen.getByText('Events Management')).toBeInTheDocument();
    expect(screen.getByText('Manage sports events and competitions')).toBeInTheDocument();
  });

  test('renders Create New Event button', () => {
    render(<Events />);
    
    expect(screen.getByRole('button', { name: 'Create New Event' })).toBeInTheDocument();
  });

  test('renders sports dropdown', () => {
    render(<Events />);
    
    expect(screen.getByTestId('sports-dropdown')).toBeInTheDocument();
  });

  test('handles sport selection', async () => {
    render(<Events />);
    
    const dropdown = screen.getByTestId('sports-dropdown');
    userEvent.selectOptions(dropdown, '1');
    
    // Check that the selection was handled (we can verify this through the mock)
    expect(dropdown).toHaveValue('1');
  });

  test('renders event cards', () => {
    render(<Events />);
    
    expect(screen.getByText('Premier League Match')).toBeInTheDocument();
    expect(screen.getByText('Manchester United vs Liverpool')).toBeInTheDocument();
    expect(screen.getByText('NBA Game')).toBeInTheDocument();
    expect(screen.getByText('Lakers vs Celtics')).toBeInTheDocument();
  });

  test('renders edit and delete buttons for each event', () => {
    render(<Events />);
    
    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });
});