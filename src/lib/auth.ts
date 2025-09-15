// Sistema de autenticação customizado para PostgreSQL
export interface User {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

class AuthService {
  private baseUrl = '/api/auth'; // Para futuro backend

  // Simula storage local para desenvolvimento
  private getStoredAuth(): AuthState {
    try {
      const stored = localStorage.getItem('auth_state');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading auth state:', error);
    }
    return { user: null, isAuthenticated: false };
  }

  private setStoredAuth(state: AuthState) {
    try {
      localStorage.setItem('auth_state', JSON.stringify(state));
    } catch (error) {
      console.error('Error storing auth state:', error);
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    // Simula validação - em produção seria chamada para API
    const validUsers = [
      {
        id: '899f1167-bc33-4587-8af5-2cca6ac8a9af',
        email: 'admin@comprovante.com',
        password: 'admin123',
        full_name: 'Administrador Sistema',
        company_name: 'Comprovante M-53',
        created_at: new Date().toISOString()
      },
      {
        id: '3aa1ee47-31d3-46ca-8121-04b2de08b29c',
        email: 'ana.livia@bcodex.io',
        password: '3C0dex@25',
        full_name: 'Ana Livia',
        company_name: 'BCodex',
        created_at: new Date().toISOString()
      }
    ];

    const user = validUsers.find(u => u.email === email && u.password === password);

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

    this.setStoredAuth({ user: authUser, isAuthenticated: true });
    return authUser;
  }

  async signUp(email: string, password: string, fullName: string): Promise<User> {
    // Em produção, faria chamada para API para criar usuário
    throw new Error('Registro de novos usuários deve ser feito pelo administrador');
  }

  async signOut(): Promise<void> {
    this.setStoredAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('auth_state');
  }

  getCurrentUser(): User | null {
    const auth = this.getStoredAuth();
    return auth.user;
  }

  isAuthenticated(): boolean {
    const auth = this.getStoredAuth();
    return auth.isAuthenticated && auth.user !== null;
  }
}

export const authService = new AuthService();