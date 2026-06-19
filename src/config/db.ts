import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10),
    dialect: 'postgres',
    logging: false, // Set to console.log to see raw SQL queries
    define: {
      timestamps: true, // Automatically handles created_at and updated_at
      underscored: true, // Matches your snake_case database columns
    },
  }
);

export default sequelize;