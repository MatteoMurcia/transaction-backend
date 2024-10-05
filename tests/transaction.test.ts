import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/app';
import { User } from '../src/models/User';
import { Transaction } from '../src/models/Transaction';
import { Server } from 'http';
import { connectDB } from '../src/utils/db';

let server: Server;
let token: string;

beforeAll(async () => {
  // Conectar a la base de datos de pruebas
  await connectDB();
  server = app.listen(5002);

  // Registrar y loguear un usuario para obtener un token
  await request(app).post('/api/auth/register').send({
    username: 'transactionuser',
    password: 'password123',
    role: 'user',
  });

  const response = await request(app).post('/api/auth/login').send({
    username: 'transactionuser',
    password: 'password123',
  });

  token = response.body.token;
});

beforeEach(async () => {
  // Limpiar las colecciones de transacciones y usuarios antes de cada test
  await Transaction.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  // Cerrar el servidor y la conexión a MongoDB
  server.close();
  await mongoose.connection.close();
});

describe('Transaction API', () => {
  it('should create a new transaction', async () => {
    const response = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`) // Asegúrate de que la línea esté completa
      .send({
        amount: 500,
      });

    expect(response.status).toBe(201);
    expect(response.body.amount).toBe(500);
  });

  it('should get all transactions (admin required)', async () => {
    const response = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`); // Asegúrate de que la línea esté completa

    expect(response.status).toBe(403); // Se espera `403` si no es admin
  });
});
