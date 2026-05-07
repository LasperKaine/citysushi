const express = require('express');
const request = require('supertest');

describe('Authentication API Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    const users = [];

    app.post('/api/auth/register', (req, res) => {
      const { email, password } = req.body;
      users.push({ id: users.length + 1, email, password });
      res.json({ success: true, user: { email } });
    });

    app.post('/api/auth/login', (req, res) => {
      const { email, password } = req.body;
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        res.json({ token: 'jwt-token', user: { id: user.id, email } });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'pass123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should login user with valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@example.com', password: 'pass123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'pass123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe('jwt-token');
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@example.com', password: 'wrong' });

    expect(res.status).toBe(401);
  });

  it('should return user data on successful login', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@example.com', password: 'pass123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'pass123' });

    expect(res.body.user.email).toBe('user@example.com');
  });

  it('should handle missing credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(401);
  });
});