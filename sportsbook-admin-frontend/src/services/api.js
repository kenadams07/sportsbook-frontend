// Base API configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Generic fetch function with error handling
const fetchApi = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// API service functions
export const api = {
  // Events
  getEvents: () => fetchApi('/events'),
  getEvent: (id) => fetchApi(`/events/${id}`),
  createEvent: (event) => fetchApi('/events', {
    method: 'POST',
    body: JSON.stringify(event),
  }),
  updateEvent: (id, event) => fetchApi(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(event),
  }),
  deleteEvent: (id) => fetchApi(`/events/${id}`, {
    method: 'DELETE',
  }),

  // Users
  getUsers: () => fetchApi('/users'),
  getUser: (id) => fetchApi(`/users/${id}`),
  updateUser: (id, user) => fetchApi(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  }),

  // Bets
  getBets: () => fetchApi('/bets'),
  getBet: (id) => fetchApi(`/bets/${id}`),
};