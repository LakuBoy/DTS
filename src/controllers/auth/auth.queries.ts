import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../models/User.model';
import { UserCompanyRole } from '../../models/UserCompanyRole.model';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, company_id } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ error: 'Invalid email or password credentials' });
      return;
    }

    const allRoles = await UserCompanyRole.findAll({ where: { user_id: user.id } });
    if (allRoles.length === 0) {
      res.status(403).json({ error: 'User is not associated with any active company tenants' });
      return;
    }

    const activeRoleMapping = company_id
      ? allRoles.find((r) => r.company_id === company_id)
      : allRoles[0];

    if (!activeRoleMapping) {
      res.status(403).json({ error: 'User does not hold access clearance for specified company' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, company_id: activeRoleMapping.company_id, role: activeRoleMapping.role },
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
        active_company_id: activeRoleMapping.company_id,
        active_role: activeRoleMapping.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal login processing error' });
  }
};