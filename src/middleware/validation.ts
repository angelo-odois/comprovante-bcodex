import { z } from 'zod';

export const validateBody = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          error: {
            message: 'Dados inválidos',
            details: result.error.issues.map(issue => ({
              field: issue.path.join('.'),
              message: issue.message
            }))
          }
        });
      }

      req.validatedBody = result.data;
      next();
    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({
        error: {
          message: 'Erro na validação dos dados'
        }
      });
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      const result = schema.safeParse(req.params);

      if (!result.success) {
        return res.status(400).json({
          error: {
            message: 'Parâmetros inválidos',
            details: result.error.issues.map(issue => ({
              field: issue.path.join('.'),
              message: issue.message
            }))
          }
        });
      }

      req.validatedParams = result.data;
      next();
    } catch (error) {
      console.error('Params validation error:', error);
      res.status(500).json({
        error: {
          message: 'Erro na validação dos parâmetros'
        }
      });
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      const result = schema.safeParse(req.query);

      if (!result.success) {
        return res.status(400).json({
          error: {
            message: 'Query parameters inválidos',
            details: result.error.issues.map(issue => ({
              field: issue.path.join('.'),
              message: issue.message
            }))
          }
        });
      }

      req.validatedQuery = result.data;
      next();
    } catch (error) {
      console.error('Query validation error:', error);
      res.status(500).json({
        error: {
          message: 'Erro na validação dos query parameters'
        }
      });
    }
  };
};

// Common validation schemas
export const schemas = {
  uuid: z.string().uuid('ID deve ser um UUID válido'),
  email: z.string().email('Email deve ter formato válido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  pagination: z.object({
    page: z.string().transform(val => parseInt(val) || 1).pipe(z.number().min(1)),
    limit: z.string().transform(val => parseInt(val) || 10).pipe(z.number().min(1).max(100))
  }).partial()
};