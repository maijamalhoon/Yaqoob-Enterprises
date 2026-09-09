"use client";

export default function GlobalError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 font-sans p-6">
        <div className="max-w-md text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-600 mb-6">
            An unexpected error occurred. Please try reloading the page.
          </p>
          {props.error?.digest ? (
            <p className="text-xs text-slate-400 mb-4 font-mono">Error ID: {props.error.digest}</p>
          ) : null}
          <button
            onClick={() => props.reset()}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition cursor-pointer"
            type="button"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
