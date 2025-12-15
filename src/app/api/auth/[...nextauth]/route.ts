import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const log = (message: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [AUTH:ROUTE] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};

// Log when the route module loads
log('NextAuth route handler initialized', {
  trustHost: true,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
});

// Enable trustHost at the handler level (useful on Vercel/proxies)
const handler = NextAuth({ ...(authOptions as any), trustHost: true });

// Wrap handlers with logging
const wrappedHandler = async (request: Request) => {
  const url = new URL(request.url);
  log('Auth request received', {
    method: request.method,
    pathname: url.pathname,
    search: url.search,
    headers: {
      host: request.headers.get('host'),
      referer: request.headers.get('referer'),
      'user-agent': request.headers.get('user-agent')?.substring(0, 50),
    },
  });
  
  try {
    const response = await handler(request);
    log('Auth response', {
      status: response?.status,
      statusText: response?.statusText,
    });
    return response;
  } catch (error) {
    console.error(`[AUTH:ROUTE] Error handling auth request:`, error);
    throw error;
  }
};

export { wrappedHandler as GET, wrappedHandler as POST };
