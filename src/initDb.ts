import fs from 'fs';
import path from 'path';
import pool from './config/db';

const runSchema = async () => {
  try {
    console.log('🔄 Reading schema.sql file...');
    
    // Resolve the path to schema.sql safely
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('🚀 Connecting to PostgreSQL and executing script...');
    
    // Execute the raw SQL text string against your database
    await pool.query(sql);
    
    console.log('✅ Database schema initialized successfully! Tables and Enums created.');
    process.exit(0); // Exit smoothly
  } catch (error) {
    console.error('❌ Failed to execute schema script:');
    console.error(error);
    process.exit(1); // Exit with failure code
  }
};

// Run the function
runSchema();