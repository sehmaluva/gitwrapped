import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchGitHubStats, processGitHubStats } from "@/lib/github";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = Date.now();
  
  logger.info('API:GITHUB_STATS', `[${requestId}] Request started`);

  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      logger.warn('API:GITHUB_STATS', `[${requestId}] Unauthorized - no session`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const username = request.nextUrl.searchParams.get("username");

    if (!username) {
      logger.warn('API:GITHUB_STATS', `[${requestId}] Bad request - no username`);
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    logger.info('API:GITHUB_STATS', `[${requestId}] Fetching stats`, { username });
    const rawStats = await fetchGitHubStats(session.accessToken, username);
    const processedStats = processGitHubStats(rawStats);
    
    const duration = Date.now() - startTime;
    logger.info('API:GITHUB_STATS', `[${requestId}] Request completed`, {
      duration: `${duration}ms`,
      totalContributions: processedStats.totalContributions,
    });

    return NextResponse.json(processedStats);
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('API:GITHUB_STATS', `[${requestId}] Failed (${duration}ms)`, error);
    
    return NextResponse.json(
      { error: "Failed to fetch GitHub stats" },
      { status: 500 }
    );
  }
}
