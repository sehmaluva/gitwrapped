"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginButton } from "@/components/auth/LoginButton";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/wrapped");
    }
  }, [session, router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Logo / Title */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            GitHub Wrapped
          </h1>
          <p className="text-xl md:text-2xl text-gray-400">
            Your Year in Code • 2025
          </p>
        </div>

        {/* Description */}
        <div className="mb-12 space-y-4">
          <p className="text-lg text-gray-300">
            Discover your coding journey this year. See your commits, pull requests,
            favorite languages, and more in a beautiful, shareable format.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              Total Contributions
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sky-400 rounded-full" />
              Top Languages
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-400 rounded-full" />
              Active Repos
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full" />
              Streak Stats
            </span>
          </div>
        </div>

        {/* Login Button */}
        <div className="mb-8">
          {status === "loading" ? (
            <div className="h-12 w-48 bg-gray-700 rounded-lg animate-pulse mx-auto" />
          ) : (
            <LoginButton />
          )}
        </div>

        {/* Preview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { label: "Commits", icon: "📝", color: "from-emerald-500 to-green-600" },
            { label: "PRs", icon: "🔀", color: "from-sky-500 to-cyan-600" },
            { label: "Reviews", icon: "👀", color: "from-teal-500 to-emerald-600" },
            { label: "Streak", icon: "🔥", color: "from-cyan-500 to-sky-600" },
          ].map((item) => (
            <div
              key={item.label}
              className={`p-4 rounded-xl bg-gradient-to-br ${item.color} opacity-80 hover:opacity-100 transition-opacity`}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-white font-semibold">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-12 text-gray-500 text-sm">
          Your data stays private. We only read public contribution data.
        </p>
      </div>
    </main>
  );
}
