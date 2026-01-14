import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  createEventRequest,
  resetCreateEventSuccess
} from '../redux/actions/createEventActions';
import {
  fetchCompetitionsRequest
} from '../redux/actions/competitionsActions';
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SportsDropdown from "../components/SportsDropdown";
import "./Events.css";

const Events = () => {
  const dispatch = useDispatch();
  const { loading: createEventLoading, error: createEventError, success: createEventSuccess } = useSelector((state) => state.createEvent);
  const { competitions, eventsData, loading: competitionsLoading } = useSelector((state) => state.competitions);
  
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState(new Set());

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    setSelectedCompetition(null);
    setEvents([]);
    setSelectedEvents(new Set());
    
    // If a sport is selected, fetch competitions
    if (sport) {
      dispatch(fetchCompetitionsRequest(sport.sportId || sport.sport_id));
    }
  };

  const handleCompetitionSelect = (e) => {
    const competitionId = e.target.value;
    const competition = competitions.find(c => c.competitionId === competitionId) || null;
    setSelectedCompetition(competition);
    
    // Filter events for the selected competition
    if (competitionId && eventsData) {
      const filteredEvents = eventsData.filter(event => 
        event.competitionId === competitionId
      );
      setEvents(filteredEvents);
    } else {
      setEvents([]);
    }
    
    // Clear selected events
    setSelectedEvents(new Set());
  };

  const handleEventSelect = (eventId) => {
    const newSelectedEvents = new Set(selectedEvents);
    if (newSelectedEvents.has(eventId)) {
      newSelectedEvents.delete(eventId);
    } else {
      newSelectedEvents.add(eventId);
    }
    setSelectedEvents(newSelectedEvents);
  };

  // Function to get event name or team names
  const getEventName = (event) => {
    if (event.event_name) return event.event_name;
    if (event.eventName) return event.eventName;
    return "Unknown Event";
  };

  // Function to convert timestamp to readable date and time
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "Unknown Date/Time";
    
    try {
      const date = new Date(timestamp);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short"
      });
      return `Date: ${formattedDate} | Time: ${formattedTime}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date/Time";
    }
  };

  // Function to get event date and time
  const getEventDateTime = (event) => {
    // Check for openDate first (as mentioned in the query)
    if (event.openDate) {
      return formatDateTime(event.openDate);
    }
    
    return "Unknown Date/Time";
  };

  // Handle create event button click
  const handleCreateEvent = () => {
    // Create event data from selected events
    const eventData = {
      selectedEvents: Array.from(selectedEvents),
      competition: selectedCompetition,
      sport: selectedSport
    };
    
    // Dispatch the create event action
    dispatch(createEventRequest(eventData));
  };

  // Reset success state when component unmounts or when needed
  useEffect(() => {
    if (createEventSuccess) {
      // Reset success state after a short delay
      const timer = setTimeout(() => {
        dispatch(resetCreateEventSuccess());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [createEventSuccess, dispatch]);

  return (
    <div className="events-page">
      <div className="page-header">
        <h1>Events Management</h1>
        <p>Manage sports events and competitions</p>
      </div>
      
      {/* Display success or error messages */}
      {createEventSuccess && (
        <div className="alert alert-success">
          Event created successfully!
        </div>
      )}
      
      {createEventError && (
        <div className="alert alert-error">
          Error: {createEventError}
        </div>
      )}
      
      <div className="events-controls">
        <div className="sports-filter">
          <label htmlFor="sports-dropdown">Filter by Sport:</label>
          <SportsDropdown 
            id="sports-dropdown"
            onSportSelect={handleSportSelect}
            selectedSport={selectedSport}
          />
        </div>
        
        <div className="competitions-filter">
          <label htmlFor="competitions-dropdown">Filter by Competition:</label>
          <select 
            id="competitions-dropdown"
            className={`sports-dropdown ${!selectedSport ? "disabled" : ""}`}
            value={selectedCompetition?.competitionId || selectedCompetition?.competition_id || ""}
            onChange={handleCompetitionSelect}
            disabled={!selectedSport || competitionsLoading}
          >
            {competitionsLoading ? (
              <option>Loading competitions...</option>
            ) : competitions.length === 0 && selectedSport ? (
              <option>No Leagues to display</option>
            ) : (
              <>
                <option value="">Select a competition</option>
                {competitions.map((competition) => (
                  <option 
                    key={competition.competitionId || competition.competition_id} 
                    value={competition.competitionId || competition.competition_id}
                  >
                    {competition.competitionName || competition.competition_name || competition.competitionId}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>
      
      {/* Events display with checkboxes */}
      {selectedCompetition && events.length > 0 && (
        <div className="events-list">
          <h2>Events for {selectedCompetition.competitionName || selectedCompetition.competition_name}</h2>
          <div className="events-row">
            {events.map((event) => (
              <div key={event.eventId} className="event-item">
                <input
                  type="checkbox"
                  id={`event-${event.eventId}`}
                  checked={selectedEvents.has(event.eventId)}
                  onChange={() => handleEventSelect(event.eventId)}
                />
                <label htmlFor={`event-${event.eventId || event.event_id || event.id}`}>
                  <Card className="event-card">
                    <h3>{getEventName(event)}</h3>
                    <p>{event.competition_name || selectedCompetition.competitionName}</p>
                    <p>{getEventDateTime(event)}</p>
                  </Card>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Message when no events are available */}
      {selectedCompetition && events.length === 0 && (
        <div className="no-events-message">
          <p>No events available for the selected competition.</p>
        </div>
      )}
      
      {/* Create Event button at the bottom */}
      <div className="page-actions-bottom">
        <Button 
          variant="primary" 
          disabled={selectedEvents.size === 0 || createEventLoading}
          onClick={handleCreateEvent}
        >
          {createEventLoading ? 'Creating...' : 'Create Event'}
        </Button>
      </div>
    </div>
  );
};

export default Events;