import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserBetsSection from './UserBetsSection';

const mockStore = configureStore([]);

describe('UserBetsSection', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      UserBets: {
        bets: [],
        loading: false,
        error: null
      }
    });
  });

  it('should render loading state', () => {
    store = mockStore({
      UserBets: {
        bets: [],
        loading: true,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <UserBetsSection userId="user123" eventId="event456" />
      </Provider>
    );

    expect(screen.getByText('Loading bets...')).toBeInTheDocument();
  });

  it('should render error state', () => {
    store = mockStore({
      UserBets: {
        bets: [],
        loading: false,
        error: 'API error'
      }
    });

    render(
      <Provider store={store}>
        <UserBetsSection userId="user123" eventId="event456" />
      </Provider>
    );

    expect(screen.getByText('Error loading bets: API error')).toBeInTheDocument();
  });

  it('should render empty state', () => {
    render(
      <Provider store={store}>
        <UserBetsSection userId="user123" eventId="event456" />
      </Provider>
    );

    expect(screen.getByText('No bets found for this event')).toBeInTheDocument();
  });

  it('should render bets', () => {
    store = mockStore({
      UserBets: {
        bets: [
          {
            runnerName: 'Team A',
            marketName: 'Match Odds',
            stake: 100,
            odds: 1.85
          }
        ],
        loading: false,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <UserBetsSection userId="user123" eventId="event456" />
      </Provider>
    );

    expect(screen.getByText('Team A')).toBeInTheDocument();
    expect(screen.getByText('Match Odds')).toBeInTheDocument();
    expect(screen.getByText('100 €')).toBeInTheDocument();
    expect(screen.getByText('Odds: 1.85')).toBeInTheDocument();
  });
});