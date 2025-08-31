import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: 0 }));
app.use('/', express.static(path.join(__dirname, '..', 'client'), { maxAge: 0 }));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });
