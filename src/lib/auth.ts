import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

// Logger utility for consistent logging
const log = (context: string, message: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [AUTH:${context}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};

const logError = (context: string, message: string, error?: unknown) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [AUTH:${context}] ERROR: ${message}`, error);
};

// Log environment configuration on module load
log('CONFIG', 'Auth module loaded', {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  GITHUB_ID: process.env.GITHUB_ID ? `${process.env.GITHUB_ID.substring(0, 8)}...` : 'NOT SET',
  GITHUB_SECRET: process.env.GITHUB_SECRET ? 'SET (hidden)' : 'NOT SET',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET (hidden)' : 'NOT SET',
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
  // Always enable debug to see what's happening
  debug: true,
  callbacks: {
    async jwt({ token, account, profile, trigger }) {
      log('JWT', 'JWT callback triggered', {
        trigger,
        hasAccount: !!account,
        hasProfile: !!profile,
        tokenUsername: token.username,
      });

      if (account) {
        log('JWT', 'Setting access token from account', {
          tokenType: account.token_type,
          scope: account.scope,
        });
        token.accessToken = account.access_token;
      }
      if (profile) {
        const username = (profile as { login?: string }).login;
        log('JWT', 'Setting username from profile', { username });
        token.username = username;
      }
      return token;
    },
    async session({ session, token }) {
      log('SESSION', 'Session callback triggered', {
        hasAccessToken: !!token.accessToken,
        username: token.username,
        userEmail: session.user?.email,
      });

      session.accessToken = token.accessToken as string;
      session.username = token.username as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      log('REDIRECT', 'Redirect callback triggered', { url, baseUrl });
      // Always redirect to base URL to avoid loops
      return baseUrl;
    },
    async signIn({ user, account, profile }) {
      log('SIGNIN', 'Sign in callback triggered', {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        provider: account?.provider,
        profileLogin: (profile as { login?: string })?.login,
      });
      return true;
    },
  },
  events: {
    async signIn(message) {
      log('EVENT', 'User signed in', {
        userId: message.user.id,
        email: message.user.email,
      });
    },
    async signOut(message) {
      log('EVENT', 'User signed out', { sessionToken: message.token?.email });
    },
    async createUser(message) {
      log('EVENT', 'User created', { userId: message.user.id });
    },
    async linkAccount(message) {
      log('EVENT', 'Account linked', {
        userId: message.user.id,
        provider: message.account.provider,
      });
    },
    async session(message) {
      log('EVENT', 'Session accessed', {
        sessionToken: message.token?.email,
      });
    },
  },
  logger: {
    error(code, ...message) {
      logError('NEXTAUTH', `Error code: ${code}`, message);
    },
    warn(code, ...message) {
      log('NEXTAUTH', `Warning code: ${code}`, message);
    },
    debug(code, ...message) {
      log('NEXTAUTH', `Debug: ${code}`, message);
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
