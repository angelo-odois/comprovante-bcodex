import api from './api';
import { User } from '@/lib/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Simulação de API - em produção seria substituído por chamadas reais
export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Simula validação de usuários do banco
    const validUsers = [
      {
        id: 'f4f9b4ce-44ba-48c5-8bd2-c3344b3c9149',
        email: 'admin@comprovante.com',
        password: 'admin123',
        full_name: 'Administrador Sistema',
        company_name: 'Comprovante M-53',
        created_at: new Date().toISOString()
      },
      {
        id: '5e007f86-dfa0-4324-9583-e1dcd43d0823',
        email: 'ana.livia@bcodex.io',
        password: '3C0dex@25',
        full_name: 'Ana Livia',
        company_name: 'BCodex',
        created_at: new Date().toISOString()
      }
    ];

    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = validUsers.find(u =>
      u.email === credentials.email &&
      u.password === credentials.password
    );

    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    const authUser: User = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      company_name: user.company_name,
      created_at: user.created_at
    };

    const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));

    return { user: authUser, token };
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Em produção faria POST /api/auth/register
    throw new Error('Registro de novos usuários deve ser feito pelo administrador');
  },

  async logout(): Promise<void> {
    // Em produção faria POST /api/auth/logout
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_state');
  },

  async refreshToken(): Promise<string> {
    // Em produção faria POST /api/auth/refresh
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');
    return token;
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;

      // Decodifica token simples (em produção seria JWT)
      const payload = JSON.parse(atob(token));

      // Busca dados atuais do usuário
      const stored = localStorage.getItem('auth_state');
      if (stored) {
        const authState = JSON.parse(stored);
        return authState.user;
      }

      return null;
    } catch {
      return null;
    }
  }
};