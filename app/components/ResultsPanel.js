"use client";

import { useState } from "react";

function ValidationBadge({ status }) {
  if (status === "confirmed") return <span className="badge badge-green">✓ Confirmed</span>;
  if (status === "partial") return <span className="badge badge-amber">⚠ Partial</span>;
  return <span className="badge badge-red">✗ Not Confirmed</span>;
}

function SummaryCards({ procedures, icd10 }) {
  const totalCPT = procedures.length;
  const totalRVU = procedures.reduce((sum, p) => sum + (parseFloat(p.work_rvu) || 0), 0);
  const highest = [...procedures].sort((a, b) => (b.work_rvu || 0) - (a.work_rvu || 0))[0];

  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      <div className="card text-center p-4">
        <div className="text-2xl font-bold text-teal-600">{totalCPT}</div>
        <div className="text-xs text-slate-500 mt-0.5">CPT Codes</div>
      </div>
      <div className="card text-center p-4">
        <div className="text-2xl font-bold text-teal-600">{totalRVU.toFixed(2)}</div>
        <div className="text-xs text-slate-500 mt-0.5">Total wRVUs</div>
      </div>
      <div className="card text-center p-4">
        <div className="text-2xl font-bold text-teal-600">{icd10?.length || 0}</div>
        <div className="text-xs text-slate-500 mt-0.5">ICD-10 Codes</div>
      </div>
    </div>
  );
}

export default function ResultsPanel({ result, loading, error, showToast }) {
  const [activeTab, setActiveTab] = useState("cpt");
  const [conversionFactor, setConversionFactor] = useState("33.57");

  if (loading) {
    return (
      <div className="card flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin" />
        <div className="text-center">
          <p className="font-semibold text-navy-800">GPT-4o is reading your operative report...</p>
          <p className="text-sm text-slate-500 mt-1">Identifying procedures · Matching 2026 CPT codes · Validating against body narrative</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-200 bg-red-50 flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl">!</div>
        <div className="text-center">
          <p className="font-semibold text-red-700">Analysis Error</p>
          <p className="text-sm text-red-600 mt-1 max-w-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card flex flex-col items-center justify-center py-24 gap-4 border-dashed">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12h6M12 9v6M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-500">Results will appear here</p>
          <p className="text-sm text-slate-400 mt-1">Paste an operative report and click Analyze</p>
        </div>
      </div>
    );
  }

  const { procedures_identified = [], icd10_codes = [], bundling_notes = [], unmatched_procedures = [], summary = {} } = result;
  const totalRVU = procedures_identified.reduce((sum, p) => sum + (parseFloat(p.work_rvu) || 0), 0);
  const cf = parseFloat(conversionFactor) || 33.57;
  const estimatedPayment = (totalRVU * cf).toFixed(2);

  const tabs = [
    { id: "cpt", label: "CPT Codes", count: procedures_identified.length },
    { id: "icd10", label: "ICD-10", count: icd10_codes.length },
    { id: "summary", label: "Summary" },
    { id: "bundling", label: "Bundling", count: bundling_notes.length },
  ];

  // CSV export
  const exportCSV = () => {
    const headers = ["CPT Code", "Description", "Approach", "Modifiers", "Work RVU", "Validation"];
    const rows = procedures_identified.map(p => [
      p.cpt_code,
      `"${p.description}"`,
      p.approach || "",
      (p.modifiers || []).join(" "),
      p.work_rvu,
      p.validation,
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    navigator.clipboard.writeText(csv);
    showToast("CSV copied to clipboard!");
  };

  const copyAll = () => {
    const text = [
      "=== CPT CODES ===",
      ...procedures_identified.map(p =>
        `${p.cpt_code} — ${p.description} | wRVU: ${p.work_rvu} | ${(p.modifiers || []).join(" ")} | ${p.validation}`
      ),
      "",
      "=== ICD-10 CODES ===",
      ...icd10_codes.map(d => `${d.code} — ${d.description}`),
      "",
      "=== SURGEON SUMMARY ===",
      summary.surgeon_summary || "",
      "",
      `Total wRVUs: ${totalRVU.toFixed(2)}`,
      `Estimated Payment (CF $${cf}): $${estimatedPayment}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    showToast("Full results copied!");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Summary cards */}
      <SummaryCards procedures={procedures_identified} icd10={icd10_codes} />

      {/* Conversion factor + estimated payment */}
      <div className="card flex items-center gap-4 flex-wrap py-3">
        <span className="text-sm font-medium text-slate-600">Conversion Factor:</span>
        <div className="flex items-center gap-1">
          <span className="text-sm text-slate-500">$</span>
          <input
            type="number"
            className="input-field w-24 py-1 text-sm"
            value={conversionFactor}
            onChange={e => setConversionFactor(e.target.value)}
            step="0.01"
          />
        </div>
        <div className="flex-1 text-right">
          <span className="text-sm text-slate-500">Est. Payment: </span>
          <span className="font-bold text-teal-600 text-base">${parseFloat(estimatedPayment).toLocaleString()}</span>
          <span className="text-xs text-slate-400 ml-1">(work RVU only)</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-0 overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-teal-600 text-teal-600 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  activeTab === tab.id ? "bg-teal-100 text-teal-700" : "bg-slate-200 text-slate-600"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* CPT Tab */}
          {activeTab === "cpt" && (
            <div>
              {procedures_identified.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-6">No CPT codes identified.</p>
              ) : (
                <div className="space-y-3">
                  {procedures_identified.map((proc, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 p-4 hover:border-teal-300 transition-colors">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-navy-900 font-mono">{proc.cpt_code}</span>
                          {proc.is_addon && <span className="badge badge-blue">Add-on</span>}
                          <ValidationBadge status={proc.validation} />
                        </div>
                        <div className="flex items-center gap-2">
                          {(proc.modifiers || []).map(m => (
                            <span key={m} className="badge bg-slate-100 text-slate-600">{m}</span>
                          ))}
                          <span className="text-teal-600 font-bold text-sm">{proc.work_rvu} wRVU</span>
                        </div>
                      </div>
                      <p className="text-sm text-navy-800 font-medium mt-1">{proc.description}</p>
                      {proc.approach && (
                        <p className="text-xs text-slate-400 mt-0.5 capitalize">Approach: {proc.approach}</p>
                      )}
                      {proc.procedure_line && (
                        <p className="text-xs text-slate-400 mt-1 italic">From: "{proc.procedure_line}"</p>
                      )}
                      {proc.validation_note && (
                        <p className={`text-xs mt-1.5 ${
                          proc.validation === "confirmed" ? "text-green-600" :
                          proc.validation === "partial" ? "text-amber-600" : "text-red-600"
                        }`}>
                          {proc.validation_note}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Unmatched procedures */}
                  {unmatched_procedures.length > 0 && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm font-semibold text-amber-700 mb-2">⚠ Requires Manual Code Review</p>
                      {unmatched_procedures.map((p, i) => (
                        <p key={i} className="text-xs text-amber-700 mt-1">• {p}</p>
                      ))}
                    </div>
                  )}

                  {/* Total RVU row */}
                  <div className="rounded-lg bg-navy-900 text-white p-4 flex items-center justify-between">
                    <span className="font-semibold">Total Work RVUs</span>
                    <span className="text-2xl font-bold text-teal-400">{totalRVU.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ICD-10 Tab */}
          {activeTab === "icd10" && (
            <div className="space-y-2">
              {icd10_codes.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-6">No ICD-10 codes identified.</p>
              ) : (
                icd10_codes.map((dx, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-teal-300 transition-colors">
                    <span className="font-mono font-bold text-navy-900 text-sm w-20 flex-shrink-0">{dx.code}</span>
                    <span className="text-sm text-navy-800 flex-1">{dx.description}</span>
                    <span className={`badge ${dx.type === "primary" ? "badge-teal" : "badge-blue"} flex-shrink-0`}>
                      {dx.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Summary Tab */}
          {activeTab === "summary" && (
            <div className="space-y-4">
              {summary.surgeon_summary && (
                <div className="rounded-lg bg-teal-50 border border-teal-100 p-4">
                  <h4 className="text-teal-700 font-semibold text-sm mb-2 flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                    Surgeon Summary
                  </h4>
                  <p className="text-sm text-teal-900 leading-relaxed">{summary.surgeon_summary}</p>
                </div>
              )}

              {summary.highest_value_procedure && (
                <div className="p-3 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Highest Value Procedure</p>
                  <p className="text-sm font-semibold text-navy-900 mt-0.5">{summary.highest_value_procedure}</p>
                </div>
              )}

              {(summary.coding_warnings || []).length > 0 && (
                <div className="rounded-lg bg-amber-50 border border-amber-100 p-4">
                  <h4 className="text-amber-700 font-semibold text-sm mb-2">⚠ Coding Warnings</h4>
                  {summary.coding_warnings.map((w, i) => (
                    <p key={i} className="text-xs text-amber-700 mt-1">• {w}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bundling Tab */}
          {activeTab === "bundling" && (
            <div className="space-y-2">
              {bundling_notes.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-6">No NCCI bundling issues identified.</p>
              ) : (
                bundling_notes.map((note, i) => (
                  <div key={i} className="p-3 rounded-lg border border-amber-200 bg-amber-50">
                    <p className="text-xs text-amber-800">• {note}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={copyAll} className="btn-secondary flex-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy All Results
        </button>
        <button onClick={exportCSV} className="btn-secondary flex-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Copy as CSV
        </button>
      </div>
    </div>
  );
}
