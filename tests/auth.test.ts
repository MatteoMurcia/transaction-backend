import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/app';
import { User } from '../src/models/User'; // Importar el modelo User
import { Server } from 'http';
import { connectDB } from '../src/utils/db';

let server: Server;

beforeAll(async () => {
  // Conectar a la base de datos de pruebas
  await connectDB();
  server = app.listen(5001);
});

beforeEach(async () => {
  // Limpiar la colección de usuarios antes de cada test
  await User.deleteMany({});
});

afterAll(async () => {
  // Cerrar el servidor y la conexión a MongoDB
  server.close();
  await mongoose.connection.close();
});

describe('Auth API', () => {
  let token: string;

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
        role: 'user',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  it('should login a user and return a token', async () => {
    // Crear un usuario para probar el login
    await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'password123',
      role: 'user',
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    token = response.body.token;
  });
});
