import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user as any;

    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    // 쿠키 대신 URL 파라미터로 토큰 전달
    res.redirect(`https://ramdom-pickup-limbuscompany-fronten.vercel.app/?token=${accessToken}`);
  },
);

export default router;
