import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          // Request read access to user profile and repos
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  // Helpful logs during setup (disabled in production automatically)
  debug: process.env.NODE_ENV !== "production",
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
    // Ensure redirects always land on our own domain
    async redirect({ url, baseUrl }) {
      try {
        const parsed = new URL(url, baseUrl);
        // Same origin or relative URL -> allow
        if (parsed.origin === baseUrl || url.startsWith("/")) {
          return parsed.toString();
        }
      } catch {
        // Fall through to baseUrl
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
