import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Games from './Games';

// Mock the fetch API
global.fetch = jest.fn();

describe('Games Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('displays loading state initially', () => {
    render(<Games />);
    expect(screen.getByText(/GAMES/i)).toBeInTheDocument();
    // Check for skeleton loading elements
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('fetches and displays games data', async () => {
    // Mock successful API response
    const mockGames = [
      {
        gameId: '1',
        name: 'Test Game 1',
        image: 'https://example.com/game1.jpg'
      },
      {
        gameId: '2',
        name: 'Test Game 2',
        image: 'https://example.com/game2.jpg'
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        status: 'success',
        data: [
          {
            providerName: 'SPRIBE',
            games: mockGames
          }
        ]
      })
    });

    render(<Games />);

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('Test Game 1')).toBeInTheDocument();
      expect(screen.getByText('Test Game 2')).toBeInTheDocument();
    });

    // Verify API call was made with correct parameters
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3005/api/gap-casino-game/providers/games?batchNumber=0&batchSize=5&providerName=SPRIBE&search='
    );
  });

  test('handles API error gracefully', async () => {
    // Mock failed API response
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<Games />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Error loading games/i)).toBeInTheDocument();
    });
  });
});