import api from './api';
import { User } from '@/lib/auth';

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  companyName?: string;
  email?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  created_at: string;
  updated_at: string;
}

export const userService = {
  async getProfile(userId: string): Promise<UserProfile> {
    return api.get(`/users/${userId}/profile`);
  },

  async updateProfile(userId: string, data: UpdateUserRequest): Promise<UserProfile> {
    return api.put(`/users/${userId}/profile`, data);
  },

  async createUser(data: CreateUserRequest): Promise<{ user: User; message: string }> {
    return api.post('/users', data);
  },

  async listUsers(): Promise<UserProfile[]> {
    return api.get('/users');
  },

  async deleteUser(userId: string): Promise<void> {
    return api.delete(`/users/${userId}`);
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    return api.put(`/users/${userId}/password`, {
      currentPassword,
      newPassword
    });
  }
};