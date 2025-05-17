export type User = {
  id: number;
  username: string | null;
  password: string | null;
  project_url: string | null;
  project_key: string | null;
  created_at: string;
  access: Record<string, any>;
  "Full Name": string | null;
  active: boolean;
};

export type UserInput = {
  username: string;
  password: string;
  project_url: string;
  project_key: string;
  access: Record<string, any>;
  "Full Name": string;
  active: boolean;
}; 