import { UserRole } from './userRole';

export interface IUserCompanyRole {
  user_id: string;
  company_id: string;
  role: UserRole;
}