// src/types/express.d.ts
import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    // Passport 유저 타입을 Prisma의 User 모델과 일치시킵니다.
    interface User extends PrismaUser {}
  }
}