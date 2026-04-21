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

        const existingUser = await prisma.user.findUnique({
          where: { email },
          select: { id: true },
        });

        const user = await prisma.user.upsert({
          where: {
            email: email,
          },
          update: {
            nickName: profile.displayName,
          },
          create: {
            email: email,
            nickName: profile.displayName || '관리자(임시)',
            provider: provider,
            providerId: providerId,
          },
        });
        if (!existingUser) {
          const defaultIdentities = await prisma.identity.findMany({
            where: { grade: 1 },
            select: { id: true },
          });

          await prisma.userIdentity.createMany({
            data: defaultIdentities.map((i) => ({
              userId: user.id,
              identityId: i.id,
              syncGrade: 1,
            })),
            skipDuplicates: true,
          });
        }
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

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
});
