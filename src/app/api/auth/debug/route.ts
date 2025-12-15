import { NextRequest, NextResponse } from "next/server";

const log = (message: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [API:AUTH_DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};

export async function GET(request: NextRequest) {
  log('Debug endpoint accessed', {
    url: request.url,
    headers: {
      host: request.headers.get('host'),
      referer: request.headers.get('referer'),
    },
  });

  // Show environment config (redacted secrets)
  const config = {
    timestamp: new Date().toISOString(),
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    VERCEL_URL: process.env.VERCEL_URL || "NOT SET",
    GITHUB_ID: process.env.GITHUB_ID ? `${process.env.GITHUB_ID.substring(0, 8)}...` : "NOT SET",
    GITHUB_SECRET: process.env.GITHUB_SECRET ? "***SET***" : "NOT SET",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "***SET***" : "NOT SET",
    NODE_ENV: process.env.NODE_ENV || "NOT SET",
    
    // Request info for debugging
    request_info: {
      host: request.headers.get('host'),
      x_forwarded_proto: request.headers.get('x-forwarded-proto'),
      x_forwarded_host: request.headers.get('x-forwarded-host'),
    },
    
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
      step4: "Make sure NEXTAUTH_URL in Vercel matches your production domain exactly (including https://)",
      step5: "Ensure NEXTAUTH_SECRET is a random string (generate with: openssl rand -base64 32)",
    },
  };

  log('Returning debug config', config);

  return NextResponse.json(config, { 
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
