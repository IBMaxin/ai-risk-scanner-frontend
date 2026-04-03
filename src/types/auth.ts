export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  tenant_id: string;
  name: string;
  secret: string;
  plan?: 'free' | 'pro' | 'enterprise';
}

export interface RegisterResponse {
  tenant_id: string;
  name: string;
  plan: string;
  created_at: string;
}
