export type UserRole = 'super_admin' | 'admin' | 'client' | 'client_receiver' | 'client_receiver_admin';

export interface Company {
  company_id: string;
  company_name: string;
  account_status: 'active' | 'suspended';
  created_at: Date;
  updated_at: Date;
}

export interface User {
  user_id: string;
  company_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Customer {
  customer_id: string;
  company_id: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string;
  email: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Ticket {
  ticket_id: string;
  company_id: string;
  customer_id: string | null;
  assigned_to: string | null;
  subject: string;
  description: string | null;
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: Date;
  updated_at: Date;
}

export interface Call {
  call_id: string;
  company_id: string;
  customer_id: string | null;
  agent_id: string | null;
  ticket_id: string | null;
  call_direction: 'inbound' | 'outbound';
  call_status: 'completed' | 'missed' | 'busy' | 'voicemail';
  duration_seconds: number;
  recording_url: string | null;
  created_at: Date;
}

export interface TicketUpdate {
  update_id: string;
  ticket_id: string;
  author_id: string | null;
  update_type: 'comment' | 'status_change' | 'reassignment';
  note_text: string;
  created_at: Date;
}