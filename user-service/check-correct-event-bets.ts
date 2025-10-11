const { Client } = require('pg');

async function checkCorrectEventBets() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '1478',
    database: process.env.DB_NAME || 'sportsbook',
  });

  try {
    await client.connect();
    
    const userId = '2648a0b3-24db-495f-9027-78ea375c2579';
    const eventId = 'sr:match:63464847'; // The correct event ID
    
    console.log(`Checking for bets with userId: ${userId} and eventId: ${eventId}`);
    
    // Check if there are any bets for the user and the correct event
    const betCount = await client.query(`
      SELECT COUNT(*) as count FROM sport_bets 
      WHERE "userId" = $1 AND "eventId" = $2
    `, [userId, eventId]);
    
    console.log(`Found ${betCount.rows[0].count} bets for userId: ${userId} and eventId: ${eventId}`);
    
    // If there are bets, let's see some details
    if (betCount.rows[0].count > 0) {
      const bets = await client.query(`
        SELECT * FROM sport_bets 
        WHERE "userId" = $1 AND "eventId" = $2
        ORDER BY "createdAt" DESC
      `, [userId, eventId]);
      
      console.log('Bets found:');
      bets.rows.forEach((bet: any, index: number) => {
        console.log(`  ${index + 1}. ID: ${bet.id}, Stake: ${bet.stake}, Selection: ${bet.selection}, Odds: ${bet.odds}, Created: ${bet.createdAt}`);
      });
    }
    
    await client.end();
  } catch (error) {
    console.error('Error:', error);
    try {
      await client.end();
    } catch (e) {
      console.error('Error closing connection:', e);
    }
  }
}

checkCorrectEventBets();