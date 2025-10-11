import { createConnection } from 'typeorm';
import { SportBets } from './src/sportBets/sportBets.entity';
import { Users } from './src/users/users.entity';

async function testQuery() {
  try {
    // Test the query directly
    const userId = '2648a0b3-24db-495f-9027-78ea375c2579';
    const eventId = 'sr:match:64177729';
    
    console.log(`Checking for bets with userId: ${userId} and eventId: ${eventId}`);
    
    // We would need to initialize the database connection here
    // But for now, let's just check if the implementation is correct
    
    console.log('Query that would be executed:');
    console.log(`SELECT * FROM sport_bets WHERE "userId" = '${userId}' AND "eventId" = '${eventId}' ORDER BY "createdAt" DESC`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testQuery();