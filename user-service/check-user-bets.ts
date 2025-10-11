const { Client } = require('pg');

async function checkUserBets() {
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
    const eventId = 'sr:match:64177729';
    
    console.log(`Checking for bets with userId: ${userId} and eventId: ${eventId}`);
    
    // Check if sport_bets table exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'sport_bets'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('sport_bets table does not exist');
      await client.end();
      return;
    }
    
    console.log('sport_bets table exists');
    
    // Check the structure of sport_bets table
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'sport_bets' 
      ORDER BY ordinal_position
    `);
    
    console.log('sport_bets table columns:');
    columns.rows.forEach((row: any) => {
      console.log(`  ${row.column_name} (${row.data_type})`);
    });
    
    // Check if there are any bets for the user and event
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
        LIMIT 5
      `, [userId, eventId]);
      
      console.log('Sample bets:');
      bets.rows.forEach((bet: any, index: number) => {
        console.log(`  ${index + 1}. ID: ${bet.id}, Stake: ${bet.stake}, Selection: ${bet.selection}, Created: ${bet.createdAt}`);
      });
    } else {
      // Check if there are any bets for the user at all
      const userBetCount = await client.query(`
        SELECT COUNT(*) as count FROM sport_bets 
        WHERE "userId" = $1
      `, [userId]);
      
      console.log(`Found ${userBetCount.rows[0].count} total bets for userId: ${userId}`);
      
      // Check if there are any bets for the event at all
      const eventBetCount = await client.query(`
        SELECT COUNT(*) as count FROM sport_bets 
        WHERE "eventId" = $1
      `, [eventId]);
      
      console.log(`Found ${eventBetCount.rows[0].count} total bets for eventId: ${eventId}`);
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

checkUserBets();