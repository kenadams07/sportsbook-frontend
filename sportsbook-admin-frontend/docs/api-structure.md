# API Structure Documentation

## Overview
This document describes the API structure and implementation patterns used in the Sportsbook Admin Frontend application. All API calls are centralized through a common service to ensure consistency, maintainability, and scalability.

## Architecture

### Constants
API endpoints are defined in `src/constants/apiEndpoints.js` to avoid hardcoded strings throughout the application.

### Service Layer
The API service in `src/services/api.js` provides a centralized interface for all HTTP requests. It handles:
- Base URL configuration using environment variables
- Request/response error handling
- Authentication headers (when needed)
- Request/response transformation

### Redux Integration
All API calls are integrated with Redux using Redux Toolkit's `createAsyncThunk` to manage:
- Loading states
- Success/error states
- Data caching
- Error handling

## Environment Configuration

### Environment Variables
The application uses environment-specific configuration files:
- `.env.development` - Development environment settings
- `.env.production` - Production environment settings

Key variables:
- `VITE_API_BASE_URL` - Base URL for the main API
- `VITE_ADMIN_API_BASE_URL` - Base URL for the admin API

## API Endpoints

### Sports
- `GET /sports` - Get all sports
- `GET /sports/:id` - Get a specific sport

### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get a specific event
- `POST /events` - Create a new event
- `PUT /events/:id` - Update an existing event
- `DELETE /events/:id` - Delete an event

### Competitions
- `GET /competitions` - Get all competitions
- `GET /competitions/:id` - Get a specific competition

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get a specific user
- `PUT /users/:id` - Update a user

### Bets
- `GET /bets` - Get all bets
- `GET /bets/:id` - Get a specific bet

## External APIs
The application integrates with external sports APIs:
- `/sports-api/all-sport_id` - Get all sports from external API
- `/sports-api/events` - Get events from external API

## Implementation Patterns

### 1. Constants Usage
```javascript
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// Usage
const response = await fetchApi(API_ENDPOINTS.GET_EVENTS);
```

### 2. Service Layer Usage
```javascript
import { api } from '../services/api';

// Usage
const events = await api.getEvents();
```

### 3. Redux Integration
```javascript
// Async action
export const fetchEvents = createAsyncThunk(
  'events/FETCH_EVENTS',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getEvents();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Reducer
const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'events/FETCH_EVENTS/pending':
      return { ...state, loading: true };
    case 'events/FETCH_EVENTS/fulfilled':
      return { ...state, loading: false, events: action.payload };
    case 'events/FETCH_EVENTS/rejected':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
```

## Best Practices

1. **Always use environment variables** for API base URLs
2. **Never hardcode API calls** in components
3. **Use constants** for all endpoint paths
4. **Handle errors gracefully** with proper user feedback
5. **Implement loading states** for better UX
6. **Use Redux** for state management of API data
7. **Follow feature-based organization** for Redux slices
8. **Write unit tests** for API services and Redux actions

## Testing

API services and Redux actions should be tested with:
- Mock API responses
- Success and error scenarios
- Loading state transitions
- Data transformation logic

Example test structure:
```javascript
describe('Events API', () => {
  it('should fetch events successfully', async () => {
    // Mock implementation
  });
  
  it('should handle fetch events error', async () => {
    // Mock implementation
  });
});
```