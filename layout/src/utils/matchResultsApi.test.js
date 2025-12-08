import { fetchMatchResults } from './matchResultsApi';

// Mock the API module
jest.mock('./api', () => ({
  get: jest.fn()
}));

import api from './api';

describe('matchResultsApi', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('fetchMatchResults', () => {
    it('should fetch match results successfully with eventId, sportId, and marketId', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: {
            status: "RS_OK",
            errorDescription: "",
            event: {
              eventId: "sr:match:66280446",
              eventName: "Suwon FC vs. Bucheon FC 1995",
              markets: {
                matchOdds: [
                  {
                    marketId: "11",
                    marketName: "Draw no bet",
                    marketType: "MATCH_ODDS",
                    marketStatus: "OPEN",
                    runners: [
                      {
                        runnerId: "4",
                        runnerName: "Suwon FC",
                        runnerStatus: "Active",
                        adjustmentFactor: 0,
                        result: ""
                      }
                    ]
                  }
                ]
              }
            }
          }
        }
      };
      
      api.get.mockResolvedValue(mockResponse);
      
      // Act
      const result = await fetchMatchResults('sr:match:66280446', 'sr:sport:1', '11');
      
      // Assert
      expect(api.get).toHaveBeenCalledWith('/sportBets/match-results?event_id=sr:match:66280446&sports_id=sr:sport:1&market_id=11');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle API errors', async () => {
      // Arrange
      const mockError = new Error('Network error');
      api.get.mockRejectedValue(mockError);
      
      // Act & Assert
      await expect(fetchMatchResults('sr:match:66280446', 'sr:sport:1', '11')).rejects.toThrow('Network error');
    });
  });
});