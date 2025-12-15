import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const config = {
    timestamp: new Date().toISOString(),
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    VERCEL_URL: process.env.VERCEL_URL || "NOT SET",
    GITHUB_ID: process.env.GITHUB_ID ? `${process.env.GITHUB_ID.substring(0, 8)}...` : "NOT SET",
    GITHUB_SECRET_SET: !!process.env.GITHUB_SECRET,
    NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV || "NOT SET",
    
    request_info: {
      host: request.headers.get('host'),
      x_forwarded_proto: request.headers.get('x-forwarded-proto'),
      x_forwarded_host: request.headers.get('x-forwarded-host'),
    },
    
    expected_callback_url: process.env.NEXTAUTH_URL 
      ? `${process.env.NEXTAUTH_URL}/api/auth/callback/github`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/api/auth/callback/github`
        : "http://localhost:3000/api/auth/callback/github",
    
    instructions: {
      step1: "Go to https://github.com/settings/developers",
      step2: "Open your OAuth App",
      step3: "Set 'Authorization callback URL' to the expected_callback_url above",
      step4: "Set NEXTAUTH_URL in Vercel to your production domain (with https://)",
      step5: "Generate NEXTAUTH_SECRET with: openssl rand -base64 32",
    },
  };

  return NextResponse.json(config, { 
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
