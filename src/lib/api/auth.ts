import { api } from './client';
import { AuthLoginPayload, AuthLoginResponse } from '@/types/user';

export const authApi = {
  login: (payload: AuthLoginPayload) => api.post<AuthLoginResponse>('/auth/login', payload, { auth: false }),
};

export default authApi;
