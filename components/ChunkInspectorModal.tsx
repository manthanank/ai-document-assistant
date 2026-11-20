"use client";

import React from "react";
import { DocumentItem } from "@/lib/types";
import { X, Layers, FileText, Bookmark } from "lucide-react";

interface ChunkInspectorModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export function ChunkInspectorModal({
  document,
  onClose,
}: ChunkInspectorModalProps) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl overflow-hidden space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{document.title}</span>
              <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                {document.chunks.length} Chunks
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              File: {document.fileName} • {document.fileSize} • ~{document.tokenCount} tokens
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Chunks List */}
        <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
          {document.chunks.map((chunk) => (
            <div
              key={chunk.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-800/80">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Bookmark className="h-3 w-3" />
                  <span>Chunk #{chunk.chunkIndex}</span>
                </span>
                <span className="text-slate-500">Page {chunk.pageNumber}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {chunk.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

