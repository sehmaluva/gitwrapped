import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import logger from "@/lib/logger";

// Log when the route module loads
logger.info('AUTH:ROUTE', 'NextAuth route handler initialized', {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
});

// Enable trustHost at the handler level (useful on Vercel/proxies)
const handler = NextAuth({ ...(authOptions as any), trustHost: true });

// Wrap handlers with logging
const wrappedHandler = async (request: Request) => {
  const url = new URL(request.url);
  const requestId = Math.random().toString(36).substring(7);
  
  logger.info('AUTH:ROUTE', `[${requestId}] Auth request`, {
    method: request.method,
    pathname: url.pathname,
    host: request.headers.get('host'),
  });
  
  try {
    const response = await handler(request);
    logger.debug('AUTH:ROUTE', `[${requestId}] Auth response`, {
      status: response?.status,
    });
    return response;
  } catch (error) {
    logger.error('AUTH:ROUTE', `[${requestId}] Auth request failed`, error);
    throw error;
  }
};

export { wrappedHandler as GET, wrappedHandler as POST };
