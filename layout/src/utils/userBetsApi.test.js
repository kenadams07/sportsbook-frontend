import { fetchUserBets } from './userBetsApi';

// Mock the API module
jest.mock('./api', () => ({
  get: jest.fn()
}));

import api from './api';

describe('userBetsApi', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('fetchUserBets', () => {
    it('should fetch user bets successfully', async () => {
      // Arrange
      const mockResponse = {
        data: {
          status: 'success',
          data: [
            {
              runnerName: 'Team A',
              marketName: 'Match Odds',
              stake: 100,
              odds: 1.85
            }
          ]
        }
      };
      
      api.get.mockResolvedValue(mockResponse);
      
      // Act
      const result = await fetchUserBets('user123', 'event456');
      
      // Assert
      expect(api.get).toHaveBeenCalledWith('/sportBets/my-bets?userId=user123&eventId=event456');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle API errors', async () => {
      // Arrange
      const mockError = new Error('Network error');
      api.get.mockRejectedValue(mockError);
      
      // Act & Assert
      await expect(fetchUserBets('user123', 'event456')).rejects.toThrow('Network error');
    });
  });
});