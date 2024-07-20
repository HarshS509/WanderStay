import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service"; // Ensure these are Prisma-compatible
import prisma from "./db"; // Import the Prisma client

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login", // Specify the custom login page path
  },
  callbacks: {
    async signIn({ user }) {
      try {
        // Check if guest exists, create if not
        const existingGuest = await getGuest(user.email);
        if (!existingGuest) {
          await createGuest({ email: user.email, fullName: user.name });
        }
        return true; // Continue with sign-in
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false; // Prevent sign-in
      }
    },
    async session({ session }) {
      try {
        // Retrieve guest information
        const guest = await getGuest(session.user.email);
        if (guest) {
          session.user.guestId = guest.id; // Adjust based on your Prisma schema
        }
        // console.log(session.user);
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session; // Return session even if there's an error
      }
    },
  },
});
