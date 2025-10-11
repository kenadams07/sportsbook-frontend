const { Client } = require('pg');

async function checkUserEventIds() {
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
    
    console.log(`Checking event IDs for userId: ${userId}`);
    
    // Get distinct event IDs for this user
    const eventIds = await client.query(`
      SELECT DISTINCT "eventId" FROM sport_bets 
      WHERE "userId" = $1
      ORDER BY "eventId"
    `, [userId]);
    
    console.log(`Found ${eventIds.rows.length} distinct event IDs for this user:`);
    eventIds.rows.forEach((row: any, index: number) => {
      console.log(`  ${index + 1}. ${row.eventId}`);
    });
    
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

checkUserEventIds();