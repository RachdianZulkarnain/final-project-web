// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        try {
          // Panggil backend login
          const response = await axios.post(
            `${process.env.BACKEND_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const user = response.data; // asumsikan { id, email, role, accessToken }

          if (!user || !user.accessToken) return null;

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            accessToken: user.accessToken,
          };
        } catch (err) {
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 jam
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },

    async session({ session, token }: any) {
      if (token.user) session.user = token.user;
      return session;
    },
  },
});
