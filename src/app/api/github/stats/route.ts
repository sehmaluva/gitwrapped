import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchGitHubStats, processGitHubStats } from "@/lib/github";

const log = (message: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [API:GITHUB_STATS] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};

const logError = (message: string, error?: unknown) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [API:GITHUB_STATS] ERROR: ${message}`, error);
};

export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = Date.now();
  
  log(`[${requestId}] Request started`, {
    url: request.url,
    method: request.method,
  });

  try {
    log(`[${requestId}] Fetching server session...`);
    const session = await getServerSession(authOptions);
    
    log(`[${requestId}] Session result`, {
      hasSession: !!session,
      hasAccessToken: !!session?.accessToken,
      username: session?.username,
      userEmail: session?.user?.email,
    });

    if (!session || !session.accessToken) {
      log(`[${requestId}] Unauthorized - no session or access token`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");

    log(`[${requestId}] Request params`, { username });

    if (!username) {
      log(`[${requestId}] Bad request - no username provided`);
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    log(`[${requestId}] Fetching GitHub stats for user: ${username}`);
    const rawStats = await fetchGitHubStats(session.accessToken, username);
    
    log(`[${requestId}] Raw stats fetched`, {
      hasUser: !!rawStats?.user,
      contributionsCollectionPresent: !!rawStats?.user?.contributionsCollection,
      repositoriesCount: rawStats?.user?.repositories?.nodes?.length,
    });

    log(`[${requestId}] Processing stats...`);
    const processedStats = processGitHubStats(rawStats);
    
    const duration = Date.now() - startTime;
    log(`[${requestId}] Request completed`, {
      duration: `${duration}ms`,
      totalContributions: processedStats.totalContributions,
      totalRepos: processedStats.topRepositories?.length,
    });

    return NextResponse.json(processedStats);
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`[${requestId}] Failed to fetch GitHub stats (after ${duration}ms)`, error);
    
    // Log more details about the error
    if (error instanceof Error) {
      logError(`[${requestId}] Error details`, {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5).join('\n'),
      });
    }
    
    return NextResponse.json(
      { error: "Failed to fetch GitHub stats" },
      { status: 500 }
    );
  }
}
