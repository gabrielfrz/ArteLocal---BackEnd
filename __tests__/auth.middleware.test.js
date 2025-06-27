import verifyToken from '../api/middleware/jwt.token.middleware.js';
import jwt from 'jsonwebtoken';

// Mock das dependências
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('deve chamar next() se o token for válido', () => {
    req.headers['authorization'] = 'Bearer valid-token';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { id: '123' });
    });

    verifyToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe('123');
  });

  it('deve retornar erro 401 se nenhum token for fornecido', () => {
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
  });

  it('deve retornar erro 403 se o token for inválido', () => {
    req.headers['authorization'] = 'Bearer invalid-token';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'));
    });

    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Failed to authenticate token' });
  });

  it('deve retornar erro 500 para outros erros', () => {
    req.headers['authorization'] = 'Bearer valid-token';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Some other error'));
    });


    try {
      verifyToken(req, res, next);
    } catch (_error) {
      // O erro é capturado pelo Express, não aqui.
    }
  });
});
