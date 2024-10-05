import express from 'express';
import { connectDB } from './utils/db';
import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';

const app = express();
app.use(express.json());

// Conexión a MongoDB
connectDB();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Exporta `app` para los tests
export { app };
