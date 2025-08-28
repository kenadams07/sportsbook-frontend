// Mock Events Server for Development
// Run with: node mock-events-server.js

import http from 'http';
import url from 'url';

const mockEvents = {
  sports: [
    {
      eventId: 'event-1',
      eventName: 'Barcelona vs Real Madrid',
      sportName: 'Football',
      sportId: 'sr:sport:1',
      openDate: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      status: 'scheduled',
      markets: [
        {
          marketId: 'market-1',
          marketName: 'Match Winner',
          outcomes: [
            { outcomeId: 'outcome-1', outcomeName: 'Barcelona', odds: 2.1 },
            { outcomeId: 'outcome-2', outcomeName: 'Real Madrid', odds: 1.8 }
          ]
        }
      ]
    },
    {
      eventId: 'event-2',
      eventName: 'Manchester United vs Liverpool',
      sportName: 'Football',
      sportId: 'sr:sport:1',
      openDate: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
      status: 'live',
      markets: [
        {
          marketId: 'market-2',
          marketName: 'Match Winner',
          outcomes: [
            { outcomeId: 'outcome-3', outcomeName: 'Manchester United', odds: 2.5 },
            { outcomeId: 'outcome-4', outcomeName: 'Liverpool', odds: 1.6 }
          ]
        }
      ]
    },
    {
      eventId: 'event-3',
      eventName: 'Lakers vs Warriors',
      sportName: 'Basketball',
      sportId: 'sr:sport:2',
      openDate: new Date(Date.now() + 1800000).toISOString(), // 30 minutes from now
      status: 'live',
      markets: [
        {
          marketId: 'market-3',
          marketName: 'Match Winner',
          outcomes: [
            { outcomeId: 'outcome-5', outcomeName: 'Lakers', odds: 1.9 },
            { outcomeId: 'outcome-6', outcomeName: 'Warriors', odds: 1.95 }
          ]
        }
      ]
    },
    {
      eventId: 'event-4',
      eventName: 'Federer vs Nadal',
      sportName: 'Tennis',
      sportId: 'sr:sport:5',
      openDate: new Date(Date.now() + 5400000).toISOString(), // 1.5 hours from now
      status: 'scheduled',
      markets: [
        {
          marketId: 'market-4',
          marketName: 'Match Winner',
          outcomes: [
            { outcomeId: 'outcome-7', outcomeName: 'Federer', odds: 2.3 },
            { outcomeId: 'outcome-8', outcomeName: 'Nadal', odds: 1.7 }
          ]
        }
      ]
    }
  ]
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (parsedUrl.pathname === '/events') {
    const sportId = parsedUrl.query.sport_id;
    const liveMatches = parsedUrl.query.live_matches === 'true';
    
    console.log(`Mock API request: ${req.url}`);
    console.log(`Sport ID: ${sportId}, Live Matches: ${liveMatches}`);
    
    // Filter events based on query parameters
    let filteredEvents = [...mockEvents.sports];
    
    if (liveMatches) {
      filteredEvents = filteredEvents.filter(event => event.status === 'live');
    } else {
      filteredEvents = filteredEvents.filter(event => event.status === 'scheduled');
    }
    
    if (sportId) {
      filteredEvents = filteredEvents.filter(event => event.sportId === sportId);
    }
    
    const response = { sports: filteredEvents };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = 2700;
server.listen(PORT, () => {
  console.log(`🚀 Mock Events Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET /events?sport_id=sr:sport:1&live_matches=true');
  console.log('  GET /events?sport_id=sr:sport:1&live_matches=false');
  console.log('  GET /events?sport_id=sr:sport:2&live_matches=true');
  console.log('  GET /events?sport_id=sr:sport:5&live_matches=false');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n📴 Shutting down mock server...');
  server.close(() => {
    console.log('Mock server closed.');
    process.exit(0);
  });
});