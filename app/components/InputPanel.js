"use client";

import { useRef } from "react";

const SAMPLE_REPORT = `PATIENT: John Doe   DATE: 05/07/2026

PREOPERATIVE DIAGNOSIS: Lumbar spinal stenosis, L4-L5 with neurogenic claudication; degenerative disc disease L4-L5.

POSTOPERATIVE DIAGNOSIS: Same.

PROCEDURES PERFORMED:
1. Posterior lumbar interbody fusion (TLIF), L4-L5
2. Posterior spinal instrumentation with pedicle screws, L4-L5
3. Lumbar laminectomy, L4-L5
4. Intraoperative neurophysiologic monitoring

SURGEON: Dr. Jane Smith, MD
ANESTHESIA: General endotracheal
ESTIMATED BLOOD LOSS: 250 mL
COMPLICATIONS: None

DESCRIPTION OF PROCEDURE:
The patient was brought to the operating room and placed under general anesthesia. After adequate induction, the patient was positioned prone on the Jackson table with all bony prominences padded. The lumbar region was prepped and draped in the standard sterile fashion.

A midline incision was made over the L4-L5 region. Subperiosteal dissection was carried out bilaterally exposing the posterior elements of L4 and L5. Fluoroscopic guidance was used throughout.

Pedicle screws were placed bilaterally at L4 and L5 using standard technique. A complete laminectomy was performed at L4-L5 removing the spinous process and bilateral laminae. The ligamentum flavum was removed. Bilateral facetectomies were performed to decompress the lateral recesses.

On the right side, the L4-L5 disc space was entered after retraction of the thecal sac. The disc was removed using pituitary rongeurs and curettes. Endplate preparation was performed. A PEEK interbody cage packed with local autograft bone was inserted into the disc space under fluoroscopic guidance. Rods were placed and the construct was compressed and locked.

Intraoperative neurophysiologic monitoring was performed throughout without significant changes from baseline.

Hemostasis was achieved. The wound was irrigated with antibiotic solution and closed in layers. The patient tolerated the procedure well.`;

export default function InputPanel({ reportText, setReportText, onAnalyze, onClear, loading }) {
  const textareaRef = useRef(null);

  const loadSample = () => {
    setReportText(SAMPLE_REPORT);
    textareaRef.current?.focus();
  };

  const charCount = reportText.length;
  const wordCount = reportText.trim() ? reportText.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-navy-900 font-semibold text-base flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Operative Report Input
          </h2>
          <button
            onClick={loadSample}
            className="text-xs text-teal-600 hover:text-teal-500 font-medium transition-colors"
          >
            Load Sample Report
          </button>
        </div>

        <textarea
          ref={textareaRef}
          className="input-field resize-none text-sm leading-relaxed"
          style={{ minHeight: "420px" }}
          placeholder={`Paste your complete operative report here...\n\nInclude:\n• Procedures Performed / Operation Performed section\n• Description of Procedure / Operative Technique\n• Pre/Postoperative Diagnoses\n• Findings\n\nThe AI reads the entire report and codes from the Procedures section, validated against the narrative body.`}
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          disabled={loading}
        />

        {/* Stats bar */}
        <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
          <span>{wordCount.toLocaleString()} words · {charCount.toLocaleString()} characters</span>
          {charCount > 0 && (
            <button
              onClick={onClear}
              className="text-slate-400 hover:text-red-500 transition-colors font-medium"
              disabled={loading}
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={onAnalyze}
        disabled={loading || !reportText.trim()}
        className="btn-primary w-full py-3 text-base"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            GPT-4o Analyzing Report...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Analyze Operative Report
          </>
        )}
      </button>

      {/* How it works */}
      <div className="card bg-teal-50 border-teal-100">
        <h3 className="text-teal-700 font-semibold text-sm mb-2">How Op Coder Assist Works</h3>
        <ol className="text-xs text-teal-800 space-y-1.5 list-decimal list-inside">
          <li><strong>Reads every word</strong> of the entire operative report</li>
          <li><strong>Extracts the Procedures section</strong> as the source of truth</li>
          <li><strong>Assigns 2026 CPT codes</strong> per procedure listed — accounting for approach, complexity, and laterality</li>
          <li><strong>Validates each code</strong> against the body narrative for documentation support</li>
          <li><strong>Returns ICD-10, modifiers, RVUs,</strong> and a surgeon-friendly summary</li>
        </ol>
      </div>
    </div>
  );
}
