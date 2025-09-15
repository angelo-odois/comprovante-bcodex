export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (err: ApiError, req: any, res: any, next: any) => {
  console.error('API Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erro interno do servidor';

  if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Serviço temporariamente indisponível';
  } else if (err.code === '23505') { // PostgreSQL unique violation
    statusCode = 409;
    message = 'Conflito: dados já existem';
  } else if (err.code === '23503') { // PostgreSQL foreign key violation
    statusCode = 400;
    message = 'Referência inválida nos dados';
  } else if (err.code === '23502') { // PostgreSQL not null violation
    statusCode = 400;
    message = 'Dados obrigatórios não fornecidos';
  }

  res.status(statusCode).json({
    error: {
      message,
      code: err.code,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err
      })
    }
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const notFoundHandler = (req: any, res: any) => {
  res.status(404).json({
    error: {
      message: 'Endpoint não encontrado',
      path: req.url,
      method: req.method
    }
  });
};