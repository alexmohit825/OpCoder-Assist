"use client";

import { useState, useCallback } from "react";
import NavBar from "./components/NavBar";
import InputPanel from "./components/InputPanel";
import ResultsPanel from "./components/ResultsPanel";
import Toast from "./components/Toast";

export default function Home() {
  const [reportText, setReportText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleAnalyze = async () => {
    if (!reportText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed. Please try again.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setReportText("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavBar />

      <main className="flex-1 container mx-auto px-4 py-6 max-w-screen-xl">
        {/* Hero strip */}
        <div className="mb-6 rounded-xl bg-navy-900 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-teal-400 font-semibold text-sm uppercase tracking-wider">
              AI-Powered · 2026 CPT &amp; ICD-10
            </p>
            <h2 className="text-white text-xl font-bold mt-0.5">
              Paste your operative report. Get accurate CPT codes instantly.
            </h2>
          </div>
          <div className="flex gap-4 text-sm text-slate-300">
            <span>✓ GPT-4o Analysis</span>
            <span>✓ No Data Stored</span>
            <span>✓ 2026 Code Set</span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <InputPanel
            reportText={reportText}
            setReportText={setReportText}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            loading={loading}
          />

          <ResultsPanel
            result={result}
            loading={loading}
            error={error}
            showToast={showToast}
          />
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Op Coder Assist is for informational purposes only. Always verify codes
          with a certified professional coder. Not a substitute for professional
          medical billing advice.
        </p>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
