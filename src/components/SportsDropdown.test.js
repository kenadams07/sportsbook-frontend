import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SportsDropdown from './SportsDropdown';
import * as api from '../services/api';

// Mock the API module
jest.mock('../services/api');

describe('SportsDropdown', () => {
  const mockSports = [
    { sport_id: '1', sport_name: 'Football' },
    { sport_id: '2', sport_name: 'Basketball' },
    { sport_id: '3', sport_name: 'Tennis' }
  ];

  const mockOnSportSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    api.api.getAllSports.mockResolvedValue(mockSports);
    
    render(<SportsDropdown onSportSelect={mockOnSportSelect} />);
    
    expect(screen.getByText('Loading sports...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  test('renders sports options after loading', async () => {
    api.api.getAllSports.mockResolvedValue(mockSports);
    
    render(<SportsDropdown onSportSelect={mockOnSportSelect} />);
    
    await waitFor(() => {
      expect(screen.getByRole('combobox')).not.toBeDisabled();
    });
    
    expect(screen.getByRole('option', { name: 'Select a sport' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Football' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Basketball' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Tennis' })).toBeInTheDocument();
  });

  test('handles sport selection', async () => {
    api.api.getAllSports.mockResolvedValue(mockSports);
    
    render(<SportsDropdown onSportSelect={mockOnSportSelect} />);
    
    await waitFor(() => {
      expect(screen.getByRole('combobox')).not.toBeDisabled();
    });
    
    const select = screen.getByRole('combobox');
    userEvent.selectOptions(select, '2');
    
    expect(mockOnSportSelect).toHaveBeenCalledWith(mockSports[1]);
  });

  test('displays error message when API fails', async () => {
    api.api.getAllSports.mockRejectedValue(new Error('API Error'));
    
    render(<SportsDropdown onSportSelect={mockOnSportSelect} />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load sports')).toBeInTheDocument();
    });
  });

  test('uses selectedSport prop to set initial value', async () => {
    api.api.getAllSports.mockResolvedValue(mockSports);
    
    render(<SportsDropdown 
      onSportSelect={mockOnSportSelect} 
      selectedSport={mockSports[1]} 
    />);
    
    await waitFor(() => {
      expect(screen.getByRole('combobox')).not.toBeDisabled();
    });
    
    expect(screen.getByRole('combobox')).toHaveValue('2');
  });
});