// Mock API service for testing
export const api = {
  // Events
  getEvents: jest.fn(),
  getEvent: jest.fn(),
  createEvent: jest.fn(),
  updateEvent: jest.fn(),
  deleteEvent: jest.fn(),

  // Sports
  getAllSports: jest.fn(),

  // Users
  getUsers: jest.fn(),
  getUser: jest.fn(),
  updateUser: jest.fn(),

  // Bets
  getBets: jest.fn(),
  getBet: jest.fn(),
};