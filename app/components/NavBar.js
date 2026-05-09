"use client";

export default function NavBar() {
  return (
    <header className="w-full bg-navy-900 border-b border-navy-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-screen-xl flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12h6M12 9v6M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" />
            </svg>
          </div>
          <div>
            <span className="text-white font-bold text-base leading-tight block">Op Coder Assist</span>
            <span className="text-slate-400 text-xs">2026 CPT &amp; ICD-10 AI Coding</span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <a href="#" className="hover:text-teal-400 transition-colors">About</a>
          <a href="#" className="hover:text-teal-400 transition-colors">Accuracy</a>
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-400 transition-colors"
          >
            Get API Key
          </a>
        </nav>
      </div>
    </header>
  );
}
