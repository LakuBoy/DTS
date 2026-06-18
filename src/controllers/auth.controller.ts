// Handles registration (hashing passwords with bcrypt) and login (generating secured JWT tokens).

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as db from '../config/db';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { company_id, first_name, last_name, email, password, role } = req.body;

    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await db.query(
      `INSERT INTO users (company_id, first_name, last_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, email, role`,
      [company_id || null, first_name, last_name, email, passwordHash, role]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    if (!user.is_active) {
      res.status(403).json({ error: 'Account is deactivated' });
      return;
    }

    const token = jwt.sign(
      { user_id: user.user_id, company_id: user.company_id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { user_id: user.user_id, first_name: user.first_name, last_name: user.last_name, role: user.role, company_id: user.company_id }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};