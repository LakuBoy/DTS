export interface ITicket {
  id: string;
  company_id: string;
  creator_id: string;
  assignee_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}