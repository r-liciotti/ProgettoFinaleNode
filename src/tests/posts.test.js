const request = require('supertest');
const app = require('../app'); // Assumendo che il tuo server Express sia in 'app.js'
const pool = require('../models/db');

// Mock del pool per evitare connessioni reali al database
jest.mock('../models/db', () => ({
  execute: jest.fn(),
}));

describe('postController API routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /posts/search', () => {
    it('should return posts matching search filters', async () => {
      pool.execute.mockResolvedValueOnce([[
        { id: 1, title: 'Test Post', created_at: '2025-01-01', user_id: 1, nickname: 'user1' },
      ]]);

      const response = await request(app)
        .get('/posts/search')
        .query({ title: 'Test', startDate: '2025-01-01', endDate: '2025-01-02' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: [{ id: 1, title: 'Test Post', created_at: '2025-01-01', user_id: 1, nickname: 'user1' }],
      });
      expect(pool.execute).toHaveBeenCalled();
    });

    it('should return validation errors for invalid inputs', async () => {
      const response = await request(app)
        .get('/posts/search')
        .query({ startDate: 'invalid-date' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /posts', () => {
    it('should create a new post', async () => {
      pool.execute.mockResolvedValueOnce([{ insertId: 123 }]);
      pool.execute.mockResolvedValueOnce([{ id: 1 }]); // Mock per l'utente

      const response = await request(app)
        .post('/posts')
        .send({ title: 'New Post', nickname: 'user1' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: { id: 123, title: 'New Post' },
      });
      expect(pool.execute).toHaveBeenCalled();
    });

    it('should return an error if required fields are missing', async () => {
      const response = await request(app)
        .post('/posts')
        .send({ title: '' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /posts/:id', () => {
    it('should return a post by ID', async () => {
      pool.execute.mockResolvedValueOnce([[
        { id: 1, title: 'Test Post', created_at: '2025-01-01' },
      ]]);

      const response = await request(app).get('/posts/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: { id: 1, title: 'Test Post', created_at: '2025-01-01' },
      });
    });

    it('should return a 404 if post not found', async () => {
      pool.execute.mockResolvedValueOnce([[]]);

      const response = await request(app).get('/posts/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Post not found');
    });
  });

  describe('PUT /posts/:id', () => {
    it('should update a post', async () => {
      pool.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .put('/posts/1')
        .send({ title: 'Updated Post' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    it('should return 404 if post not found', async () => {
      pool.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const response = await request(app)
        .put('/posts/999')
        .send({ title: 'Updated Post' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Post not found');
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should delete a post', async () => {
      pool.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app).delete('/posts/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    it('should return 404 if post not found', async () => {
      pool.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const response = await request(app).delete('/posts/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Post not found');
    });
  });
});
