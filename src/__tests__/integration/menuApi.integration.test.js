const express = require('express');
const request = require('supertest');

describe('Menu API Integration Tests', () => {
  let app;
  const menuItems = [
    { id: 1, name: 'California Roll', category: 'rolls', price: 12.99 },
    { id: 2, name: 'Tempura', category: 'tempura', price: 14.99 },
    { id: 3, name: 'Sashimi Platter', category: 'sashimi', price: 24.99 }
  ];

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.get('/api/menu', (req, res) => {
      res.json(menuItems);
    });

    app.get('/api/menu/:id', (req, res) => {
      const item = menuItems.find(m => m.id === parseInt(req.params.id));
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    });

    app.get('/api/menu/category/:category', (req, res) => {
      const items = menuItems.filter(m => m.category === req.params.category);
      res.json(items);
    });
  });

  it('should fetch all menu items', async () => {
    const res = await request(app).get('/api/menu');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  it('should fetch specific menu item', async () => {
    const res = await request(app).get('/api/menu/1');

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('California Roll');
  });

  it('should return 404 for non-existent item', async () => {
    const res = await request(app).get('/api/menu/999');

    expect(res.status).toBe(404);
  });

  it('should filter menu by category', async () => {
    const res = await request(app).get('/api/menu/category/rolls');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].category).toBe('rolls');
  });

  it('should return empty array for non-existent category', async () => {
    const res = await request(app).get('/api/menu/category/pizza');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});