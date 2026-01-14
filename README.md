# Sportsbook Admin Frontend

Admin dashboard for managing sportsbook operations including events, odds, and user accounts.

## Tech Stack
- React 18
- Vite
- JavaScript (ES6+)
- Redux Toolkit
- React Redux

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Testing

```bash
npm test
```

Note: Tests require additional configuration for ES modules. See the testing section below for more details.

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/         # Base UI components (Button, Card, Input, etc.)
│   └── Layout.jsx  # Main layout component
├── pages/          # Page components (Login, Dashboard, etc.)
├── hooks/          # Custom React hooks
├── services/       # API service functions
├── store/          # Redux store configuration
│   ├── features/   # Feature-based Redux modules
│   │   ├── create-event/  # Create event feature
│   │   │   ├── createEventActions.js
│   │   │   ├── createEventReducer.js
│   │   │   ├── createEventTypes.js
│   │   │   └── index.js
│   └── index.js    # Store configuration
├── utils/          # Utility functions
├── context/        # React context providers
├── styles/         # Global styles and theme files
├── assets/         # Static assets (images, icons)
├── App.jsx         # Main App component
└── main.jsx        # Entry point
```

## Features

### Events Management
- View and manage sports events
- Filter events by sport using the dynamic sports dropdown
- Create, edit, and delete events
- Redux-based state management for event operations
