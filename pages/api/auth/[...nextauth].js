import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, profile }) {
      // Attach GitHub user ID to token if available
      if (profile) {
        token.githubId = profile.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Make GitHub ID available in the session object
      session.user.githubId = token.githubId;
      return session;
    },
  },
};

export default NextAuth(authOptions);
