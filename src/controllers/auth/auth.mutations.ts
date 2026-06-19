import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../../models/User.model';
import { UserCompanyRole } from '../../models/UserCompanyRole.model';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { first_name, last_name, email, password, role, company_id } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
        first_name,
        last_name,
        email,
        password_hash: passwordHash,
        id: ''
    });

    await UserCompanyRole.create({
      user_id: createdUser.id,
      company_id,
      role,
    });

    res.status(201).json({
      id: createdUser.id,
      first_name: createdUser.first_name,
      last_name: createdUser.last_name,
      email: createdUser.email,
      company_id,
      role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal error during registration processing' });
  }
};