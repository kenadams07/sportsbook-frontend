import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllUserBets } from '../../redux/Action/userBetsActions';
import { useNavigate } from 'react-router-dom';

const MyBets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.GetUserData);
  const { bets, loading, error } = useSelector(state => state.UserBets);

  useEffect(() => {
    if (userData?._id) {
      dispatch(fetchAllUserBets(userData._id));
    }
  }, [dispatch, userData]);

  // Helper function to get sport name from sport ID
  const getSportName = (sportId) => {
    const sportNames = {
      'sr:sport:1': 'Football',
      'sr:sport:2': 'Tennis',
      'sr:sport:3': 'Basketball',
      'sr:sport:4': 'Ice Hockey',
      'sr:sport:5': 'Volleyball',
      'sr:sport:6': 'Handball',
      'sr:sport:7': 'Baseball',
      'sr:sport:8': 'American Football',
      'sr:sport:9': 'Boxing',
      'sr:sport:10': 'MMA',
      'sr:sport:11': 'Rugby',
      'sr:sport:12': 'Cricket',
      'sr:sport:13': 'Golf',
      'sr:sport:14': 'Darts',
      'sr:sport:15': 'Snooker',
      'sr:sport:16': 'Table Tennis',
      'sr:sport:17': 'Badminton',
      'sr:sport:18': 'Tennis (Live)',
      'sr:sport:19': 'Esports',
      'sr:sport:20': 'Politics',
      'sr:sport:21': 'Aussie Rules'
    };
    return sportNames[sportId] || sportId;
  };

  // Helper function to get event name from event ID
  const getEventName = (eventId) => {
    // In a real implementation, you would likely have to fetch event details
    // from another API endpoint to get the actual event name
    // For now, we'll return a formatted version of the eventId
    return eventId.replace('sr:match:', 'Match ').replace(/_/g, ' ');
  };

  const handleBetClick = (bet) => {
    // Only redirect if the bet is in pending status
    if (bet.status === '1' || bet.status === 'pending') {
      // Navigate to event view with the event ID
      navigate(`/live_events/event-view#${bet.eventId}`);
      
      // Optionally, you could dispatch an action to highlight the event
      // or scroll to it on the event view page
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-live-accent"></div>
        <span className="ml-3 text-lg text-live-primary">Loading your bets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-live-tertiary p-4 rounded border border-live-accent">
        <div className="text-live-error text-center text-sm">Error loading bets: {error}</div>
      </div>
    );
  }

  if (!bets || bets.length === 0) {
    return (
      <div className="bg-live-tertiary p-6 rounded border border-live-accent">
        <div className="text-live-muted text-center text-sm">You have not placed any bets yet</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group bets by event_id
  const groupedBets = bets.reduce((acc, bet) => {
    if (!acc[bet.eventId]) {
      acc[bet.eventId] = {
        eventId: bet.eventId,
        sportId: bet.sportId,
        eventName: bet.eventName || getEventName(bet.eventId),
        sportName: bet.sportName || getSportName(bet.sportId),
        eventDate: bet.createdAt,
        bets: []
      };
    }
    acc[bet.eventId].bets.push(bet);
    return acc;
  }, {});

  // Convert grouped bets to array for rendering
  const groupedBetsArray = Object.values(groupedBets);

  const handleGroupedBetClick = (eventId) => {
    // Find the sport key based on the sport ID in the grouped bet
    const groupedBet = groupedBets[eventId];
    let sportKey = null;
    
    // Map sportId to sport key based on common sports
    if (groupedBet && groupedBet.sportId) {
      switch (groupedBet.sportId) {
        case 'sr:sport:1':
          sportKey = 'soccer';
          break;
        case 'sr:sport:2':
          sportKey = 'basketball';
          break;
        case 'sr:sport:3':
          sportKey = 'baseball';
          break;
        case 'sr:sport:4':
          sportKey = 'ice_hockey';
          break;
        case 'sr:sport:5':
          sportKey = 'tennis';
          break;
        case 'sr:sport:21':
          sportKey = 'cricket';
          break;
        case 'sr:sport:23':
          sportKey = 'volleyball';
          break;
        case 'sr:sport:31':
          sportKey = 'badminton';
          break;
        case 'sr:sport:16':
          sportKey = 'american_football';
          break;
        case 'sr:sport:12':
          sportKey = 'rugby';
          break;
        case 'sr:sport:22':
          sportKey = 'darts';
          break;
        case 'sr:sport:19':
          sportKey = 'snooker';
          break;
        case 'sr:sport:29':
          sportKey = 'futsal';
          break;
        default:
          sportKey = null;
      }
    }
    
    // Navigate to event view with the event ID and sport key as location state
    navigate(`/live_events/event-view`, { 
      state: { 
        selectedGameId: eventId,
        selectedSportKey: sportKey
      }
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-live-primary mb-4">My Bets</h2>
      
      <div className="space-y-3">
        {groupedBetsArray.map((group, index) => (
          <div 
            key={group.eventId || index} 
            className="bg-live-secondary rounded-lg p-4 border border-live border-opacity-30 hover:bg-opacity-80 transition-colors cursor-pointer"
            onClick={() => handleGroupedBetClick(group.eventId)}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <div className="text-xs text-live-muted">Event Name</div>
                <div className="text-sm font-medium text-blue-500 hover:text-blue-400 cursor-pointer underline">
                  {group.eventName}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-live-muted">Sport</div>
                <div className="text-sm font-medium text-live-primary">
                  {group.sportName}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-live-muted">Date</div>
                <div className="text-sm font-medium text-live-primary">
                  {formatDate(group.eventDate)}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-live-muted">Bets</div>
                <div className="text-sm font-medium text-live-primary">
                  {group.bets.length}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBets;