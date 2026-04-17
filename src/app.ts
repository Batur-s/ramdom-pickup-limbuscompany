import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import './config/passport'; // 전략 파일 로드
import authRoutes from './features/auth/routes';
import cookieParser from 'cookie-parser';
import userRoutes from './features/user/user.route';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

export { app };
export default app;
