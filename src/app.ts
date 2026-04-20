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

dotenv.config();

const app = express();

app.use(cookieParser());

// JWT 인증도 쿠키 기반으로 쓸 예정이면 keep
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

// passport는 OAuth/strategy를 쓰는 라우트에서만 필요해도,
// initialize는 app 단에서 한 번만 해주면 충분
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/user', meRouter);
app.use('/identity', meIdentitiesRouter);
app.use('/game', gamesRouter);

export { app };
export default app;
