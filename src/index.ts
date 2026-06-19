import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db';
import { initAssociations } from './models/associations';

import authRoutes from './routes/auth.routes';
import companyRoutes from './routes/company.routes';
import ticketRoutes from './routes/ticket.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize ORM DB Model Relationships
initAssociations();

// Active Endpoint Routers Mapping
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/tickets', ticketRoutes);

const bootstrapApplication = async () => {
  try {
    // Authenticate and synchronize model states with PostgreSQL safely
    await sequelize.authenticate();
    console.log('✅ Sequelize successfully connected to the PostgreSQL instance!');
    
    // sync() will ensure the schema matches without erasing existing database setups
    await sequelize.sync();
    console.log('✅ All DB models successfully synchronized with database engine.');

    app.listen(PORT, () => {
      console.log(`🚀 Dugu Core ORM API running on service port allocation: ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to safely initialize application engine dependencies:');
    console.error(error);
    process.exit(1);
  }
};

bootstrapApplication();