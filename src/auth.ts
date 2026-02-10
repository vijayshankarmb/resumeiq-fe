import NextAuth from "next-auth"
import Google from "next-auth/providers/google" 

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
      
      if (isApiAuthRoute) return true;

      if (!isLoggedIn) {
        return false; // Redirect to login
      }
      return true;
    },
  },
})