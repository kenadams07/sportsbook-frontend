# Sportsbook Admin Frontend

Admin dashboard for managing sportsbook operations including events, odds, and user accounts.

## Tech Stack
- React 18
- Vite
- JavaScript (ES6+)

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

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/         # Base UI components (Button, Card, Input, etc.)
│   └── Layout.jsx  # Main layout component
├── pages/          # Page components (Login, Dashboard, etc.)
├── hooks/          # Custom React hooks
├── services/       # API service functions
├── utils/          # Utility functions
├── context/        # React context providers
├── styles/         # Global styles and theme files
├── assets/         # Static assets (images, icons)
├── App.jsx         # Main App component
└── main.jsx        # Entry point
```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the project for production
- `npm run lint` - Runs ESLint
- `npm run preview` - Previews the production build locally