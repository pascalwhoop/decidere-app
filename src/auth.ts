import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth: _auth, request: { nextUrl: _nextUrl } }) {
      // Basic protection if needed
      return true
    },
  },
  secret: process.env.AUTH_SECRET,
})
