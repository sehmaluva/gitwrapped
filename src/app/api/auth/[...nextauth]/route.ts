import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Enable trustHost at the handler level (useful on Vercel/proxies)
const handler = NextAuth({ ...(authOptions as any), trustHost: true });

export { handler as GET, handler as POST };
