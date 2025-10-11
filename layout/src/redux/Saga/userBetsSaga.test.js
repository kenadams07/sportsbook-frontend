import { call, put } from 'redux-saga/effects';
import { fetchUserBetsRequest } from './userBetsSaga';
import { fetchUserBetsSuccess, fetchUserBetsFailure } from '../Action/userBetsActions';
import { fetchUserBets as fetchUserBetsAPI } from '../../utils/userBetsApi';

describe('userBetsSaga', () => {
  describe('fetchUserBetsRequest', () => {
    const action = {
      payload: {
        userId: 'user123',
        eventId: 'event456'
      }
    };

    it('should fetch user bets successfully', () => {
      // Arrange
      const mockResponse = {
        status: 'success',
        data: [
          {
            runnerName: 'Team A',
            marketName: 'Match Odds',
            stake: 100,
            odds: 1.85
          }
        ]
      };

      // Act
      const generator = fetchUserBetsRequest(action);
      
      // First yield - call to API
      let next = generator.next();
      expect(next.value).toEqual(call(fetchUserBetsAPI, 'user123', 'event456'));
      
      // Second yield - put success action
      next = generator.next(mockResponse);
      expect(next.value).toEqual(put(fetchUserBetsSuccess(mockResponse.data)));
      
      // Third yield - done
      next = generator.next();
      expect(next.done).toBe(true);
    });

    it('should handle API failure', () => {
      // Arrange
      const error = new Error('API error');
      const generator = fetchUserBetsRequest(action);
      
      // First yield - call to API
      let next = generator.next();
      expect(next.value).toEqual(call(fetchUserBetsAPI, 'user123', 'event456'));
      
      // Second yield - put failure action
      next = generator.throw(error);
      expect(next.value).toEqual(put(fetchUserBetsFailure('Failed to fetch user bets')));
      
      // Third yield - done
      next = generator.next();
      expect(next.done).toBe(true);
    });
  });
});