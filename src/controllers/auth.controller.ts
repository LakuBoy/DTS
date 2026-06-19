import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as db from '../config/db';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { first_name, last_name, email, password, role, company_id } = req.body;

    // Validate email uniqueness
    const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    // Secure password hashing
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user directly matching your latest schema structure
    const newUser = await db.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role, company_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, email, role, company_id`,
      [first_name, last_name, email, passwordHash, role, company_id || null]
    );

    const createdUser = newUser.rows[0];

    // Seed the junction table user_company_roles automatically if assigned to a company
    if (company_id) {
      await db.query(
        `INSERT INTO user_company_roles (user_id, company_id, role) VALUES ($1, $2, $3)`,
        [createdUser.id, company_id, role]
      );
    }

    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal error during registration processing' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Pull profile data while checking for soft-delete states
    const result = await db.query('SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ error: 'Invalid email or password credentials' });
      return;
    }

    // Sign securely with structural identity parameters
    const token = jwt.sign(
      { id: user.id, company_id: user.company_id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        company_id: user.company_id
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal login runtime exception' });
  }
};