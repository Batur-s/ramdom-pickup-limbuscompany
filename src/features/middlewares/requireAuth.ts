// middlewares/requireAuth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// export function requireAuth(req: Request, res: Response, next: NextFunction) {
//   const token = req.cookies?.accessToken;

//   if (!token) return res.status(401).json({ message: 'Not authenticated' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
//     req.user = { id: decoded.id, email: decoded.email }; // controller에서 사용

//     return next();
//   } catch {ah
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// }
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken ?? req.headers.authorization?.replace('Bearer ', '');

  // console.log('token received:', token?.substring(0, 20)); // 토큰 앞부분만 출력
  // console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = { id: decoded.id, email: decoded.email };
    return next();
  } catch (e) {
    console.log('JWT verify error:', e);
    return res.status(401).json({ message: 'Invalid token' });
  }
}
