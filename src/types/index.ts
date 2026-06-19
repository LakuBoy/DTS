export type UserRole = 'super_admin' | 'client_admin' | 'client' | 'client_receivers_admin' | 'client_receivers';

export interface Company {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface Ticket {
  id: string;
  company_id: string;
  creator_id: string;
  assignee_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface UserCompanyRole {
  user_id: string;
  company_id: string;
  role: UserRole;
}

export interface TicketStatus {
  id: string;
  company_id: string;
  name: string;
  sort_order: number;
}

export interface TicketEvent {
  id: string;
  ticket_id: string;
  changed_by_user_id: string;
  field_changed: string;
  old_value: string | null;
  new_value: string | null;
  created_at: Date;
}