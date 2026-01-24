// Quick database check script
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'designflow',
});

async function checkDatabase() {
  try {
    await client.connect();
    console.log('✅ Database connection successful!');
    
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\n📊 Existing tables:');
    if (result.rows.length === 0) {
      console.log('   No tables found. TypeORM will create them on startup.');
    } else {
      result.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
    }
    
    await client.end();
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. PostgreSQL is running');
    console.log('   2. Database "designflow" exists');
    console.log('   3. .env file has correct credentials');
    process.exit(1);
  }
}

checkDatabase();
