// Essential for live calls—looks up callers or signs them up quickly.

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import * as db from '../config/db';

export const getOrCreateCustomerByPhone = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id;
    const { phone_number, first_name, last_name, email } = req.body;

    if (!companyId) {
      res.status(400).json({ error: 'Company context required' });
      return;
    }

    // Check if customer exists in this company
    const existing = await db.query(
      'SELECT * FROM customers WHERE company_id = $1 AND phone_number = $2',
      [companyId, phone_number]
    );

    if (existing.rows.length > 0) {
      res.json({ customer: existing.rows[0], isNew: false });
      return;
    }

    // Create a new one on the fly during a call event
    const newCustomer = await db.query(
      `INSERT INTO customers (company_id, phone_number, first_name, last_name, email)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [companyId, phone_number, first_name || null, last_name || null, email || null]
    );

    res.status(201).json({ customer: newCustomer.rows[0], isNew: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing customer record' });
  }
};

export const getCompanyCustomers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id;
    const result = await db.query('SELECT * FROM customers WHERE company_id = $1 ORDER BY created_at DESC', [companyId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};