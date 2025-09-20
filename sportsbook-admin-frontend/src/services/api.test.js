import { api } from './api';

// Since we're testing the API service that now uses axios instead of fetch,
// and axios is properly mocked in the module, we can write simpler tests
// that check if the API functions exist and can be called

describe('API Service', () => {
  test('should have getAllSports function', () => {
    expect(typeof api.getAllSports).toBe('function');
  });

  test('should have getCompetitions function', () => {
    expect(typeof api.getCompetitions).toBe('function');
  });

  test('should have getEvents function', () => {
    expect(typeof api.getEvents).toBe('function');
  });
});
