import { api } from './client';
import { NewUserPayload, User } from '@/types/user';

export interface CreateUserResponse {
  message?: string;
  data: User;
}

export const usersApi = {
  create: (payload: NewUserPayload) => api.post<CreateUserResponse>('/users', payload, { auth: false }),
  me: () => api.get<User>('/users/me'),
};

export default usersApi;
