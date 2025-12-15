"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProcessedStats } from "@/lib/github";
import { WrappedView } from "@/components/wrapped/WrappedView";
import { LoadingState } from "@/components/wrapped/LoadingState";

export default function WrappedPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<ProcessedStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }
  }, [status]);

  useEffect(() => {
    async function fetchStats() {
      if (!session?.username) return;

      try {
        // Use the GitHub username from the session
        const response = await fetch(`/api/github/stats?username=${session.username}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchStats();
    }
  }, [session]);

  if (status === "loading" || loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-800 max-w-md">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/"
            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold inline-block transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <LoadingState />;
  }

  return <WrappedView stats={stats} />;
}
