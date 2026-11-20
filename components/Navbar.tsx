"use client";

import React, { useState } from "react";
import {
  FileText,
  Upload,
  Sparkles,
  Database,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { UsageQuota } from "@/lib/types";

interface NavbarProps {
  quota: UsageQuota;
  onOpenUpload: () => void;
}

export function Navbar({ quota, onOpenUpload }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const remainingPercent = Math.max(
    0,
    100 - Math.round((quota.tokensConsumed / quota.monthlyBudget) * 100)
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-white text-base tracking-tight flex items-center gap-2">
              <span>DocuMind AI</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Database className="h-3 w-3" />
                <span>pgvector HNSW</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">RAG Document Intelligence & Semantic Q&A</p>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Token quota pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs font-mono">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-slate-400">Tokens:</span>
            <span className="text-white font-bold">{remainingPercent}% budget left</span>
          </div>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenUpload}
            className="p-2 rounded-xl bg-cyan-600 text-white shadow-sm"
            aria-label="Upload Document"
          >
            <Upload className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 p-4 space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Monthly Token Allowance:</span>
            <span className="text-amber-400 font-bold">{remainingPercent}% remaining</span>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenUpload();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-600 text-white text-sm font-semibold"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>
      )}
    </header>
  );
}

