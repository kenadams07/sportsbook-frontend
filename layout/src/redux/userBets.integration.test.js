import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './Reducer';
import rootSaga from './Saga';
import { fetchUserBets } from './Action/userBetsActions';

// Mock the API
jest.mock('../utils/userBetsApi', () => ({
  fetchUserBets: jest.fn()
}));

import { fetchUserBets as fetchUserBetsAPI } from '../utils/userBetsApi';

describe('User Bets Integration', () => {
  let store;
  let sagaMiddleware;

  beforeEach(() => {
    sagaMiddleware = createSagaMiddleware();
    store = createStore(reducers, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(rootSaga);
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should fetch user bets successfully', (done) => {
    // Arrange
    const mockBets = [
      {
        selection: 'Team A',
        marketName: 'Match Odds',
        stake: 100,
        odds: 1.85
      }
    ];
    
    fetchUserBetsAPI.mockResolvedValue(mockBets);
    
    // Subscribe to store changes
    store.subscribe(() => {
      const state = store.getState();
      if (!state.UserBets.loading && state.UserBets.bets.length > 0) {
        // Assert
        expect(state.UserBets.bets).toEqual(mockBets);
        expect(state.UserBets.error).toBeNull();
        done();
      }
    });
    
    // Act
    store.dispatch(fetchUserBets('user123', 'event456'));
  });

  it('should handle fetch user bets failure', (done) => {
    // Arrange
    const errorMessage = 'Failed to fetch user bets';
    fetchUserBetsAPI.mockRejectedValue(new Error(errorMessage));
    
    // Subscribe to store changes
    store.subscribe(() => {
      const state = store.getState();
      if (!state.UserBets.loading && state.UserBets.error) {
        // Assert
        expect(state.UserBets.bets).toEqual([]);
        expect(state.UserBets.error).toBe(errorMessage);
        done();
      }
    });
    
    // Act
    store.dispatch(fetchUserBets('user123', 'event456'));
  });
});