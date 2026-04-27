export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  zip_code?: string | null;
  address?: string | null;
  address_2?: string | null;
  role?: 'user' | 'admin' | string;
  status?: 'active' | 'inactive' | string;
  created_at?: string;
  updated_at?: string;
}

export interface NewUserPayload extends Partial<User> {
  username: string;
  email: string;
  password: string;
}

export interface AuthLoginPayload {
  username: string;
  password: string;
}

export interface AuthLoginResponse {
  access_token: string;
  expiresIn: number;
  userId: string;
}
