import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { WrappedView } from "@/components/wrapped/WrappedView";
import { getGitHubStats } from "@/lib/github";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your GitHub Wrapped 2025",
  description: "See your coding year in review",
};

export default async function WrappedPage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || !session?.username) {
    redirect("/");
  }

  try {
    const stats = await getGitHubStats(session.accessToken, session.username);

    return (
      <main className="min-h-screen bg-slate-950">
        <WrappedView stats={stats} />
      </main>
    );
  } catch (error) {
    console.error("Failed to load stats:", error);
    redirect("/auth/error?error=FetchError");
  }
}
