const express = require('express');
const request = require('supertest');

describe('Payment Processing E2E', () => {
  let app;
  const payments = [];
  let paymentIdCounter = 1;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    payments.length = 0;
    paymentIdCounter = 1;

    app.post('/api/payments/process', (req, res) => {
      const { orderId, amount, cardToken } = req.body;
      if (!orderId || !amount || !cardToken) {
        return res.status(400).json({ error: 'Missing payment details' });
      }

      // Simulate payment processing
      const payment = {
        id: paymentIdCounter++,
        orderId,
        amount,
        status: 'success',
        timestamp: new Date()
      };
      payments.push(payment);
      res.status(201).json(payment);
    });

    app.post('/api/payments/refund', (req, res) => {
      const { paymentId } = req.body;
      const payment = payments.find(p => p.id === paymentId);
      if (payment) {
        payment.status = 'refunded';
        res.json({ success: true, payment });
      } else {
        res.status(404).json({ error: 'Payment not found' });
      }
    });

    app.get('/api/payments/:id', (req, res) => {
      const payment = payments.find(p => p.id === parseInt(req.params.id));
      if (payment) {
        res.json(payment);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    });
  });

  it('should process payment successfully', async () => {
    const res = await request(app)
      .post('/api/payments/process')
      .send({ 
        orderId: 1, 
        amount: 29.99, 
        cardToken: 'tok_visa' 
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.amount).toBe(29.99);
  });

  it('should reject payment without card token', async () => {
    const res = await request(app)
      .post('/api/payments/process')
      .send({ orderId: 1, amount: 29.99 });

    expect(res.status).toBe(400);
  });

  it('should retrieve payment details', async () => {
    await request(app)
      .post('/api/payments/process')
      .send({ orderId: 1, amount: 29.99, cardToken: 'tok_visa' });

    const res = await request(app).get('/api/payments/1');

    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(29.99);
  });

  it('should process refund for payment', async () => {
    const paymentRes = await request(app)
      .post('/api/payments/process')
      .send({ orderId: 1, amount: 29.99, cardToken: 'tok_visa' });
    const paymentId = paymentRes.body.id;

    const refundRes = await request(app)
      .post('/api/payments/refund')
      .send({ paymentId });

    expect(refundRes.status).toBe(200);
    expect(refundRes.body.payment.status).toBe('refunded');
  });

  it('should handle multiple concurrent payments', async () => {
    const res1 = await request(app)
      .post('/api/payments/process')
      .send({ orderId: 1, amount: 10, cardToken: 'tok_visa1' });

    const res2 = await request(app)
      .post('/api/payments/process')
      .send({ orderId: 2, amount: 20, cardToken: 'tok_visa2' });

    expect(res1.status).toBe(201);
    expect(res2.status).toBe(201);
    expect(res1.body.id).not.toBe(res2.body.id);
  });
});