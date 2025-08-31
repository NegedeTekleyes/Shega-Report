import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import authRoutes from './routes/auth';
import complianceRoutes from './routes/compliance';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:19006', 'exp://localhost:19000'],
//   credentials: true,
// }));

app.use(cors())

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/compliances', complianceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

(async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
})();
