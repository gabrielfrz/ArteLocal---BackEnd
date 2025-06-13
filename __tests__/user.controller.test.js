import request from 'supertest';
import express from 'express';
import userRoute from '../api/routes/user.route.js';
import { createUser, authenticateUser } from '../api/services/user.service.js';

// Mocking the user service
jest.mock('../api/services/user.service.js');

const app = express();
app.use(express.json());
app.use('/user', userRoute);

describe('User Controller', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Testes para o registro de usuário
  describe('POST /user/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      createUser.mockResolvedValue({ email: 'test@example.com' });

      const res = await request(app)
        .post('/user/register')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('deve retornar erro 400 se faltarem campos', async () => {
      const res = await request(app)
        .post('/user/register')
        .send({ name: 'Test User', email: 'test@example.com' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Name, email and password are required');
    });

    it('deve retornar erro 400 para formato de e-mail inválido', async () => {
        const res = await request(app)
          .post('/user/register')
          .send({ name: 'Test User', email: 'invalid-email', password: 'password123' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Invalid email format');
      });

      it('deve retornar erro 400 se a senha for muito curta', async () => {
        const res = await request(app)
          .post('/user/register')
          .send({ name: 'Test User', email: 'test@example.com', password: '123' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Password must be at least 6 characters long');
      });

    it('deve retornar erro 400 se o e-mail já estiver em uso', async () => {
      createUser.mockRejectedValue(new Error('Email already in use'));

      const res = await request(app)
        .post('/user/register')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Email already in use');
    });
  });

  // Testes para o login de usuário
  describe('POST /user/login', () => {
    it('deve logar o usuário com sucesso e retornar um token', async () => {
      authenticateUser.mockResolvedValue({ token: 'fake-jwt-token', name: 'Test User' });

      const res = await request(app)
        .post('/user/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('name', 'Test User');
    });

    it('deve retornar erro 400 se faltarem campos', async () => {
        const res = await request(app)
          .post('/user/login')
          .send({ email: 'test@example.com' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Email and password are required');
      });

    it('deve retornar erro 400 para credenciais inválidas', async () => {
      authenticateUser.mockRejectedValue(new Error('Invalid credentials'));

      const res = await request(app)
        .post('/user/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
});