"use client";

import React from "react";
import { DocumentItem } from "@/lib/types";
import { FileText, Layers, Trash2, Eye, Plus, Sparkles } from "lucide-react";

interface DocumentListProps {
  documents: DocumentItem[];
  onInspectDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (id: string) => void;
  onOpenUpload: () => void;
}

export function DocumentList({
  documents,
  onInspectDocument,
  onDeleteDocument,
  onOpenUpload,
}: DocumentListProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" />
            <span>Knowledge Base ({documents.length})</span>
          </h3>
          <p className="text-[11px] text-slate-400">Indexed PDF whitepapers & vector chunks</p>
        </div>

        <button
          onClick={onOpenUpload}
          className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Upload</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-2.5 flex-grow overflow-y-auto max-h-[380px] pr-1">
        {documents.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            No documents uploaded yet. Upload a PDF or select a technical whitepaper sample.
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {doc.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                    <span>{doc.fileName}</span>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteDocument(doc.id)}
                  className="p-1 rounded text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove document"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Chunk Info & Inspect */}
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-mono text-[10px]">
                  <Layers className="h-3 w-3 text-cyan-400" />
                  <span>{doc.chunks.length} chunks</span>
                  <span>({doc.tokenCount} tokens)</span>
                </span>

                <button
                  onClick={() => onInspectDocument(doc)}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Eye className="h-3 w-3" />
                  <span>Inspect Chunks</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

