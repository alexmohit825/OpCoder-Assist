"use client";

export default function Toast({ message, type = "success" }) {
  const colors =
    type === "success"
      ? "bg-navy-900 text-white"
      : "bg-red-600 text-white";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${colors}`}
      style={{ animation: "fadeInUp 0.2s ease" }}
    >
      {type === "success" ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <span>!</span>
      )}
      {message}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
