export interface AuthMiddleware {
  requireAuth: () => (req: any, res: any, next: any) => void;
  optionalAuth: () => (req: any, res: any, next: any) => void;
  validateToken: (token: string) => Promise<{ valid: boolean; user?: any }>;
}

export const authMiddleware: AuthMiddleware = {
  requireAuth: () => {
    return async (req: any, res: any, next: any) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'Token de acesso obrigatório' });
        }

        const token = authHeader.substring(7);
        const validation = await authMiddleware.validateToken(token);

        if (!validation.valid) {
          return res.status(401).json({ error: 'Token inválido ou expirado' });
        }

        req.user = validation.user;
        next();
      } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Erro de autenticação' });
      }
    };
  },

  optionalAuth: () => {
    return async (req: any, res: any, next: any) => {
      try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          const validation = await authMiddleware.validateToken(token);

          if (validation.valid) {
            req.user = validation.user;
          }
        }
        next();
      } catch (error) {
        console.error('Optional auth middleware error:', error);
        next();
      }
    };
  },

  validateToken: async (token: string) => {
    try {
      const payload = JSON.parse(atob(token));

      if (!payload.userId || !payload.timestamp) {
        return { valid: false };
      }

      const tokenAge = Date.now() - payload.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (tokenAge > maxAge) {
        return { valid: false };
      }

      return {
        valid: true,
        user: {
          id: payload.userId,
          timestamp: payload.timestamp
        }
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  }
};