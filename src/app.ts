import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/passport'; // 전략 파일 로드
import passport from 'passport';
import authRoutes from './features/auth/routes';
import cookieParser from 'cookie-parser';
import { meRouter } from './features/user/user.routes';
import { meIdentitiesRouter } from './features/identity/identity.routes';
import { gamesRouter } from './features/game/game.routes';
import { sinnersRouter } from './features/sinner/sinner.routes';

dotenv.config();

const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (
      !origin ||
      origin.includes('localhost') ||
      origin.includes('vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/user', meRouter);
app.use('/identity', meIdentitiesRouter);
app.use('/game', gamesRouter);
app.use('/sinner', sinnersRouter);

export { app };
export default app;
