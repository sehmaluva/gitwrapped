import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

// Determine the base URL for callbacks
const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: {
          scope: "read:user user:email repo",
          // Force the exact redirect_uri to match GitHub OAuth App config
          redirect_uri: `${getBaseUrl()}/api/auth/callback/github`,
        },
      },
      token: "https://github.com/login/oauth/access_token",
      userinfo: "https://api.github.com/user",
    }),
  ],
  // Enable debug in non-production or when NEXTAUTH_DEBUG is set
  debug: process.env.NODE_ENV !== "production" || process.env.NEXTAUTH_DEBUG === "true",
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and username to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      if (profile) {
        // GitHub profile includes login (username)
        token.username = (profile as { login?: string }).login;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.username = token.username as string;
      return session;
    },
    // Harden redirects to avoid nested callbackUrl loops and cross-origin redirects
    async redirect({ url, baseUrl }) {
      try {
        const base = new URL(baseUrl);
        const target = new URL(url, baseUrl);

        // Enforce same-origin
        if (target.origin !== base.origin) return base.toString();

        // Drop redirects that contain nested callbackUrl params or OAuth errors
        const cb = target.searchParams.get("callbackUrl");
        const hasNestedCallback = cb ? /callbackUrl=/.test(cb) : false;
        const hasError = target.searchParams.has("error");
        if (hasNestedCallback || hasError) return base.toString();

        // Allow safe same-origin url (including relative)
        return target.toString();
      } catch {
        return baseUrl;
      }
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
