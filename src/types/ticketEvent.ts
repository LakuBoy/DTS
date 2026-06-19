export interface ITicketEvent {
  id: string;
  ticket_id: string;
  changed_by_user_id: string;
  field_changed: string;
  old_value: string | null;
  new_value: string | null;
  created_at?: Date;
}