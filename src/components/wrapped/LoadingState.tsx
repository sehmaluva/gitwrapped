"use client";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-gray-700" />
          <div className="absolute inset-0 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Generating Your Wrapped...
        </h2>
        <p className="text-gray-400">
          Analyzing your GitHub activity for 2025
        </p>
        <div className="mt-8 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
