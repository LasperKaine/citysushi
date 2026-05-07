const express = require('express');
const request = require('supertest');

describe('Orders API Integration Tests', () => {
  let app;
  const orders = [];
  let orderIdCounter = 1;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    orders.length = 0;
    orderIdCounter = 1;

    app.post('/api/orders', (req, res) => {
      const { userId, items, total } = req.body;
      if (!userId || !items) {
        return res.status(400).json({ error: 'Missing fields' });
      }
      const order = { id: orderIdCounter++, userId, items, total, status: 'pending' };
      orders.push(order);
      res.status(201).json(order);
    });

    app.get('/api/orders/:id', (req, res) => {
      const order = orders.find(o => o.id === parseInt(req.params.id));
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    });

    app.put('/api/orders/:id', (req, res) => {
      const order = orders.find(o => o.id === parseInt(req.params.id));
      if (order) {
        Object.assign(order, req.body);
        res.json(order);
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    });
  });

  it('should create a new order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ userId: 1, items: [{ id: 1, price: 12.99 }], total: 12.99 });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('pending');
  });

  it('should retrieve order by id', async () => {
    await request(app)
      .post('/api/orders')
      .send({ userId: 1, items: [{ id: 1 }], total: 12.99 });

    const res = await request(app).get('/api/orders/1');

    expect(res.status).toBe(200);
    expect(res.body.userId).toBe(1);
  });

  it('should return 404 for non-existent order', async () => {
    const res = await request(app).get('/api/orders/999');

    expect(res.status).toBe(404);
  });

  it('should update order status', async () => {
    await request(app)
      .post('/api/orders')
      .send({ userId: 1, items: [{ id: 1 }], total: 12.99 });

    const res = await request(app)
      .put('/api/orders/1')
      .send({ status: 'confirmed' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('confirmed');
  });

  it('should reject order without required fields', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ userId: 1 });

    expect(res.status).toBe(400);
  });
});