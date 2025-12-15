import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import logger from "./logger";

// Log environment configuration on module load (production-safe)
logger.info('AUTH:CONFIG', 'Auth module initialized', {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
  GITHUB_ID: process.env.GITHUB_ID ? `${process.env.GITHUB_ID.substring(0, 8)}...` : 'NOT SET',
  GITHUB_SECRET_SET: !!process.env.GITHUB_SECRET,
  NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET,
  NODE_ENV: process.env.NODE_ENV,
});

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  // Only enable NextAuth debug in development
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, account, profile, trigger }) {
      logger.debug('AUTH:JWT', 'JWT callback', {
        trigger,
        hasAccount: !!account,
        hasProfile: !!profile,
      });

      if (account) {
        logger.info('AUTH:JWT', 'New OAuth sign-in', {
          tokenType: account.token_type,
          scope: account.scope,
        });
        token.accessToken = account.access_token;
      }
      if (profile) {
        const username = (profile as { login?: string }).login;
        token.username = username;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.username = token.username as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      logger.debug('AUTH:REDIRECT', 'Redirect callback', { url, baseUrl });
      return baseUrl;
    },
    async signIn({ user, account, profile }) {
      logger.info('AUTH:SIGNIN', 'User signing in', {
        userId: user.id,
        provider: account?.provider,
        username: (profile as { login?: string })?.login,
      });
      return true;
    },
  },
  events: {
    async signIn(message) {
      logger.info('AUTH:EVENT', 'Sign in complete', {
        userId: message.user.id,
      });
    },
    async signOut(message) {
      logger.info('AUTH:EVENT', 'User signed out', {
        email: message.token?.email,
      });
    },
  },
  logger: {
    error(code, ...message) {
      logger.error('AUTH:NEXTAUTH', `Error: ${code}`, message[0]);
    },
    warn(code) {
      logger.warn('AUTH:NEXTAUTH', `Warning: ${code}`);
    },
    debug(code) {
      logger.debug('AUTH:NEXTAUTH', `Debug: ${code}`);
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
