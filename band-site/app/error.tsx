"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Page Error!</h2>
      <p style={{ color: "red" }}>{error.message}</p>
      <pre style={{ background: "#eee", padding: "1rem" }}>{error.stack}</pre>
    </div>
  );
}
