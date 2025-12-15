"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect } from "react";
import { signOut } from "next-auth/react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const callbackUrl = searchParams.get("callbackUrl");

  // Log error details to console for debugging
  useEffect(() => {
    console.log('[AUTH:ERROR_PAGE]', JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      error,
      errorDescription,
      callbackUrl,
      allParams: Object.fromEntries(searchParams.entries()),
    }));
  }, [error, errorDescription, callbackUrl, searchParams]);

  const errorMessages: Record<string, string> = {
    OAuthCallback: "There was a problem with the GitHub authentication. This usually means the OAuth app is misconfigured.",
    OAuthSignin: "Could not start the GitHub sign-in process.",
    OAuthAccountNotLinked: "This email is already associated with another account.",
    Callback: "There was an error during the authentication callback.",
    AccessDenied: "Access was denied. You may have cancelled the sign-in or don't have permission.",
    Configuration: "There's a server configuration issue. Check the OAuth settings.",
    Verification: "The verification token has expired or has already been used.",
    Default: "An authentication error occurred.",
  };

  const message = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-800/50 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
        <p className="text-gray-400 mb-6">{message}</p>
        
        {error && (
          <div className="bg-gray-900 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500">Error code:</p>
            <code className="text-red-400 text-sm">{error}</code>
          </div>
        )}

        {errorDescription && (
          <div className="bg-gray-900 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500">Details:</p>
            <code className="text-orange-400 text-sm break-all">{errorDescription}</code>
          </div>
        )}

        {callbackUrl && (
          <div className="bg-gray-900 rounded-lg p-3 mb-6">
            <p className="text-xs text-gray-500">Callback URL:</p>
            <code className="text-yellow-400 text-xs break-all">{callbackUrl}</code>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-emerald-600 hover:from-sky-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-colors"
          >
            Try Again
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Logout & Retry
          </button>
          <Link
            href="/api/auth/debug"
            className="block w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm"
          >
            View Debug Info
          </Link>
          <button
            onClick={() => {
              const debugInfo = {
                timestamp: new Date().toISOString(),
                error,
                errorDescription,
                callbackUrl,
                allParams: Object.fromEntries(searchParams.entries()),
                href: window.location.href,
                referrer: document.referrer,
              };
              console.log('[AUTH:ERROR_PAGE] Debug info:', debugInfo);
              navigator.clipboard?.writeText(JSON.stringify(debugInfo, null, 2));
              alert('Debug info copied to clipboard and logged to console!');
            }}
            className="block w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm"
          >
            Copy Debug Info
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          If this keeps happening, check the browser console (F12) and Vercel logs for details.
        </p>
      </div>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    }>
      <ErrorContent />
    </Suspense>
  );
}
