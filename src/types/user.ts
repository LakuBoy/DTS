export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}