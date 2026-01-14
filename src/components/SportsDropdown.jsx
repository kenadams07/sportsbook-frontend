import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSportsRequest } from '../redux/actions/sportsActions';
import './SportsDropdown.css';

const SportsDropdown = ({ onSportSelect, selectedSport, className = '' }) => {
  const dispatch = useDispatch();
  const { sports, loading, error } = useSelector((state) => state.sports);

  useEffect(() => {
    // Fetch sports data when component mounts
    dispatch(fetchAllSportsRequest());
  }, [dispatch]);

  const handleChange = (e) => {
    const sportId = e.target.value;
    const sport = sports.find(s => 
      s.sportId === sportId || s.sport_id === sportId || s.id === sportId
    ) || null;
    onSportSelect(sport);
  };

  if (loading) {
    return <select className={`sports-dropdown ${className}`} disabled>
      <option>Loading sports...</option>
    </select>;
  }

  if (error) {
    return <div className={`sports-dropdown-error ${className}`}>Error: {error}</div>;
  }

  // Check if sports array is empty
  if (sports.length === 0) {
    return <select className={`sports-dropdown ${className}`} disabled>
      <option>No sports available</option>
    </select>;
  }

  return (
    <select 
      className={`sports-dropdown ${className}`}
      value={selectedSport?.sportId || selectedSport?.sport_id || selectedSport?.id || ''}
      onChange={handleChange}
    >
      <option value="">Select a sport</option>
      {sports.map((sport) => (
        <option 
          key={sport.sportId || sport.sport_id || sport.id} 
          value={sport.sportId || sport.sport_id || sport.id}
        >
          {sport.sportName || sport.sport_name || sport.name || sport.sportId || sport.sport_id || sport.id}
        </option>
      ))}
    </select>
  );
};

export default SportsDropdown;