import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define the secret used to encrypt the token (should be the same as in your NextAuth config)
const secret = process.env.NEXTAUTH_SECRET;

// Middleware function to protect routes
export async function middleware(req) {
  // Get the token from cookies
  const token = await getToken({ req, secret });

  // Check if the user is authenticated
  if (!token) {
    // If not authenticated, redirect to the sign-in page
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If authenticated, allow the request to proceed
  return NextResponse.next();
}

// Configuration for the middleware
export const config = {
  matcher: ["/account/:path*"], // Apply middleware to `/account` and any sub-paths
};
