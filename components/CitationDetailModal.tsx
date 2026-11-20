"use client";

import React from "react";
import { Citation } from "@/lib/types";
import { X, Bookmark, FileText, CheckCircle2 } from "lucide-react";

interface CitationDetailModalProps {
  citation: Citation | null;
  onClose: () => void;
}

export function CitationDetailModal({
  citation,
  onClose,
}: CitationDetailModalProps) {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Bookmark className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Source Citation Inspector</h3>
              <p className="text-xs text-slate-400">Grounded context retrieved from vector database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Citation Metadata */}
        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 grid grid-cols-3 gap-2 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Document</span>
            <span className="text-white font-semibold truncate block mt-0.5">
              {citation.documentTitle}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Page</span>
            <span className="text-cyan-400 font-semibold block mt-0.5">
              Page {citation.pageNumber}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Similarity Match</span>
            <span className="text-emerald-400 font-bold block mt-0.5">
              {(citation.similarity * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Snippet Quote */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 mb-1">Extracted Source Text:</h4>
          <blockquote className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/30 text-xs text-slate-200 leading-relaxed italic font-serif">
            "{citation.snippet}"
          </blockquote>
        </div>

        <div className="pt-2 flex justify-end border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

