const express = require('express');
const request = require('supertest');

describe('Complete User Journey E2E', () => {
  let app;
  const users = [];
  const orders = [];
  let userIdCounter = 1;
  let orderIdCounter = 1;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    users.length = 0;
    orders.length = 0;
    userIdCounter = 1;
    orderIdCounter = 1;

    // Auth endpoints
    app.post('/api/auth/register', (req, res) => {
      const { email, password } = req.body;
      const user = { id: userIdCounter++, email, password };
      users.push(user);
      res.status(201).json({ user: { id: user.id, email } });
    });

    app.post('/api/auth/login', (req, res) => {
      const { email, password } = req.body;
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        res.json({ token: 'jwt-token', userId: user.id });
      } else {
        res.status(401).json({ error: 'Invalid' });
      }
    });

    // Order endpoints
    app.post('/api/orders', (req, res) => {
      const { userId, items, total } = req.body;
      const order = { 
        id: orderIdCounter++, 
        userId, 
        items, 
        total, 
        status: 'placed',
        createdAt: new Date()
      };
      orders.push(order);
      res.status(201).json(order);
    });

    app.get('/api/orders/user/:userId', (req, res) => {
      const userOrders = orders.filter(o => o.userId === parseInt(req.params.userId));
      res.json(userOrders);
    });

    app.get('/api/orders/:id', (req, res) => {
      const order = orders.find(o => o.id === parseInt(req.params.id));
      if (order) res.json(order);
      else res.status(404).json({ error: 'Not found' });
    });

    app.put('/api/orders/:id', (req, res) => {
      const order = orders.find(o => o.id === parseInt(req.params.id));
      if (order) {
        Object.assign(order, req.body);
        res.json(order);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    });
  });

  it('should complete full user journey signup to order', async () => {
    // 1. Register
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@example.com', password: 'pass123' });
    expect(regRes.status).toBe(201);
    const userId = regRes.body.user.id;

    // 2. Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'pass123' });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.userId).toBe(userId);

    // 3. Place order
    const orderRes = await request(app)
      .post('/api/orders')
      .send({ userId, items: [{ id: 1, name: 'Roll', price: 12.99 }], total: 12.99 });
    expect(orderRes.status).toBe(201);
    const orderId = orderRes.body.id;

    // 4. Track order
    const trackRes = await request(app).get(`/api/orders/${orderId}`);
    expect(trackRes.status).toBe(200);
    expect(trackRes.body.status).toBe('placed');
  });

  it('should retrieve user order history', async () => {
    // Register and login
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@example.com', password: 'pass123' });
    const userId = regRes.body.user.id;

    // Create multiple orders
    await request(app)
      .post('/api/orders')
      .send({ userId, items: [{ id: 1 }], total: 10 });
    await request(app)
      .post('/api/orders')
      .send({ userId, items: [{ id: 2 }], total: 15 });

    // Get order history
    const histRes = await request(app).get(`/api/orders/user/${userId}`);
    expect(histRes.status).toBe(200);
    expect(histRes.body).toHaveLength(2);
  });

  it('should update order status through lifecycle', async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@example.com', password: 'pass123' });
    const userId = regRes.body.user.id;

    const orderRes = await request(app)
      .post('/api/orders')
      .send({ userId, items: [{ id: 1 }], total: 12.99 });
    const orderId = orderRes.body.id;

    // Update through lifecycle
    const statuses = ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
    for (const status of statuses) {
      const updateRes = await request(app)
        .put(`/api/orders/${orderId}`)
        .send({ status });
      expect(updateRes.status).toBe(200);
    }

    const finalRes = await request(app).get(`/api/orders/${orderId}`);
    expect(finalRes.body.status).toBe('delivered');
  });

  it('should handle multiple user accounts', async () => {
    // Register two users
    const user1Res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user1@example.com', password: 'pass1' });
    const user1Id = user1Res.body.user.id;

    const user2Res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user2@example.com', password: 'pass2' });
    const user2Id = user2Res.body.user.id;

    // Create orders for each
    await request(app)
      .post('/api/orders')
      .send({ userId: user1Id, items: [{ id: 1 }], total: 10 });
    await request(app)
      .post('/api/orders')
      .send({ userId: user2Id, items: [{ id: 2 }], total: 15 });

    // Verify isolation
    const orders1 = await request(app).get(`/api/orders/user/${user1Id}`);
    const orders2 = await request(app).get(`/api/orders/user/${user2Id}`);

    expect(orders1.body).toHaveLength(1);
    expect(orders2.body).toHaveLength(1);
  });
});