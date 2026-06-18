import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db';

// Import routers explicitly
import authRoutes from './routes/auth.routes';
import ticketRoutes from './routes/ticket.routes';
import customerRoutes from './routes/customer.routes';
import callRoutes from './routes/call.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Attach Sub-Routers
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/calls', callRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', database: 'connected', serverTime: new Date() });
});

// --- DATABASE CONNECTION TEST ---
const testDbConnection = async () => {
  try {
    // Run a simple primitive query to see if the database responds
    const res = await pool.query('SELECT NOW()');
    console.log(`✅ Database connected successfully! Server time: ${res.rows[0].now}`);
  } catch (err) {
    console.error('❌ Database connection failed!');
    console.error(err);
    process.exit(1); // Kill the server if the database isn't working
  }
};

app.listen(PORT, async () => {
  console.log('Dugu Ticketing listening safely.');
  await testDbConnection(); // Test the database connection when the server starts
});