import { NextResponse } from "next/server";

export async function GET() {
  // Show environment config (redacted secrets)
  const config = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    VERCEL_URL: process.env.VERCEL_URL || "NOT SET",
    GITHUB_ID: process.env.GITHUB_ID ? `${process.env.GITHUB_ID.substring(0, 8)}...` : "NOT SET",
    GITHUB_SECRET: process.env.GITHUB_SECRET ? "***SET***" : "NOT SET",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "***SET***" : "NOT SET",
    NODE_ENV: process.env.NODE_ENV || "NOT SET",
    
    // The callback URL that should be registered in GitHub
    expected_callback_url: process.env.NEXTAUTH_URL 
      ? `${process.env.NEXTAUTH_URL}/api/auth/callback/github`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/api/auth/callback/github`
        : "http://localhost:3000/api/auth/callback/github",
    
    // Instructions
    instructions: {
      step1: "Go to https://github.com/settings/developers",
      step2: "Open your OAuth App",
      step3: "Set 'Authorization callback URL' to the expected_callback_url shown above",
      step4: "Make sure NEXTAUTH_URL in Vercel matches your production domain exactly",
    },
  };

  return NextResponse.json(config, { 
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
