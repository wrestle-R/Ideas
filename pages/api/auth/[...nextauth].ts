  import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import type { Profile } from "next-auth";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      githubId?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    githubId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, profile }: { token: any; profile?: any }) {
      // Attach GitHub user ID to token if available
      if (profile) {
        token.githubId = profile.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Make GitHub ID available in the session object
      if (session.user) {
        session.user.githubId = token.githubId;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
