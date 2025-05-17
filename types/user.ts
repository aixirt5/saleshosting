export interface User {
  id: number;
  username: string | null;
  password: string | null;
  project_url: string | null;
  project_key: string | null;
  created_at: string;
  access: Record<string, any>;
}

export type UserInput = Omit<User, 'id' | 'created_at'>; 