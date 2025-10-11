import {
  FETCH_USER_BETS,
  FETCH_USER_BETS_SUCCESS,
  FETCH_USER_BETS_FAILURE,
  SKIP_NEXT_USER_BETS_FETCH
} from "./actionTypes";

// Fetch user bets actions
export const fetchUserBets = (userId, eventId) => {
  return {
    type: FETCH_USER_BETS,
    payload: { userId, eventId },
  };
};

export const fetchUserBetsSuccess = (bets) => {
  return {
    type: FETCH_USER_BETS_SUCCESS,
    payload: bets,
  };
};

export const fetchUserBetsFailure = (error) => {
  return {
    type: FETCH_USER_BETS_FAILURE,
    payload: error,
  };
};

// Action to skip the next automatic fetch
export const skipNextUserBetsFetch = () => {
  return {
    type: SKIP_NEXT_USER_BETS_FETCH,
  };
};