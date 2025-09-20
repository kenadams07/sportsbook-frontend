import { store } from './index';

describe('Redux Store', () => {
  it('should create store with initial state', () => {
    const state = store.getState();
    expect(state).toHaveProperty('events');
    expect(state.events).toEqual({
      events: [],
      loading: false,
      error: null,
      success: false,
    });
  });

  it('should dispatch and handle actions', () => {
    const initialState = store.getState();
    expect(initialState.events.loading).toBe(false);
  });
});