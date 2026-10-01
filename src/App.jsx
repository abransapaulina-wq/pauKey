import React from 'react';
import PasswordChecker from './components/PasswordChecker';
import { KeyRound } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Header Compacto pauKey */}
      <header className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-xl text-slate-950 font-bold shadow-md shadow-cyan-500/20">
              <KeyRound className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white leading-none flex items-center gap-1.5">
                pau<span className="text-cyan-400">Key</span>
                <span className="text-[10px] font-mono font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">v1.0</span>
              </h1>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 border border-slate-800 rounded-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>100% Client-Side</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <PasswordChecker />
      </main>

    </div>
  );
}
