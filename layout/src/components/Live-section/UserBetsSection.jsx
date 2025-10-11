import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserBets } from '../../redux/Action/userBetsActions';

const UserBetsSection = ({ userId, eventId }) => {
  const dispatch = useDispatch();
  const { bets, loading, error, skipNextFetch } = useSelector(state => state.UserBets);

  useEffect(() => {
    if (userId && eventId) {
      dispatch(fetchUserBets(userId, eventId));
    }
  }, [dispatch, userId, eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-live-accent"></div>
        <span className="ml-2 text-live-primary">Loading bets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-live-tertiary p-3 rounded border border-live-accent">
        <div className="text-live-error text-center">Error loading bets: {error}</div>
      </div>
    );
  }

  if (!bets || bets.length === 0) {
    return (
      <div className="bg-live-tertiary p-3 rounded border border-live-accent">
        <div className="text-live-muted text-center">No bets placed for this event</div>
      </div>
    );
  }

  return (
    <div className="bg-live-tertiary rounded border border-live-accent">
      <div className="border-b border-live-accent px-3 py-2">
        <h3 className="text-sm font-bold text-live-accent">My Bets</h3>
      </div>
      <div className="p-2" style={{ maxHeight: '160px', overflowY: 'auto' }}>
        {bets.map((bet, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-live-hover last:border-b-0">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-live-primary">{bet.selection}</span>
              <span className="text-[10px] text-live-muted">{bet.marketName}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-live-accent">{bet.stake} €</span>
              <span className="text-[10px] text-live-muted">Odds: {bet.odds}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBetsSection;