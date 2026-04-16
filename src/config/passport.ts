import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import prisma from './../lib/prisma';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        const email = profile.emails?.[0]?.value;
        const provider = profile.provider;
        const providerId = profile.id;

        if (!email) return done(new Error('No email found'));

        const user = await prisma.user.upsert({
          where: {
            // 이메일을 기준으로 찾을지, provider 조합으로 찾을지 결정 (이메일 추천)
            email: email,
          },
          update: {
            // 로그인할 때마다 이름 정도는 최신화해줄 수 있습니다.
            nickName: profile.displayName,
          },
          create: {
            email: email,
            nickName: profile.displayName || '관리자(임시)',
            provider: provider,
            providerId: providerId,
          },
        });

        console.log(user ? `✅ 유저 확인: ${user.email}` : `🆕 신규 등록`);
        return done(null, user);
      } catch (error) {
        console.error('❌ Passport Strategy Error:', error);
        return done(error as Error);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});
