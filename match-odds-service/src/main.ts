import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Create express router for proxy endpoints
  const router = express.Router();
  
  // Enable CORS for your frontend and handle preflight requests
  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://user-api.xfair91.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
      return res.status(204).send();
    }
    next();
  });

  // Proxy endpoint for events
  router.get('/api/events', async (req, res) => {
    try {
      // Forward query parameters to third-party API
      const queryParams = new URLSearchParams(req.query as any).toString();
      const baseUrl = process.env.MATCH_ODDS_API || 'http://89.116.20.218:2700';
      const url = `${baseUrl}/events${queryParams ? `?${queryParams}` : ''}`;
      
      console.log(`Proxying request to: ${url}`);
      
      const response = await axios.default.get(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Forward the response back to the client
      res.json(response.data);
    } catch (error: any) {
      console.error('Events proxy error:', error.message);
      res.status(500).json({ 
        error: 'Failed to fetch events data', 
        message: error.message 
      });
    }
  });

  // Proxy endpoint for markets
  router.get('/api/markets', async (req, res) => {
    try {
      // Forward query parameters to third-party API
      const queryParams = new URLSearchParams(req.query as any).toString();
      const baseUrl = process.env.MATCH_ODDS_API || 'http://89.116.20.218:2700';
      const url = `${baseUrl}/markets${queryParams ? `?${queryParams}` : ''}`;
      
      console.log(`Proxying request to: ${url}`);
      
      const response = await axios.default.get(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Forward the response back to the client
      res.json(response.data);
    } catch (error: any) {
      console.error('Markets proxy error:', error.message);
      res.status(500).json({ 
        error: 'Failed to fetch markets data', 
        message: error.message 
      });
    }
  });

  // Apply the router to the NestJS app
  const expressInstance = app.getHttpAdapter().getInstance();
  expressInstance.use('/', router);

  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  console.log(`Match Odds Service running on http://localhost:${port}`);
}
bootstrap();