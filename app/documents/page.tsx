"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { INITIAL_DOCUMENTS } from "@/lib/mock-data";
import { DocumentItem } from "@/lib/types";
import { DocumentUploadModal } from "@/components/DocumentUploadModal";
import { ChunkInspectorModal } from "@/components/ChunkInspectorModal";
import { 
  FolderArchive, Search, Plus, FileText, Trash2, 
  Layers, CheckCircle2, Database, Sparkles, HardDrive 
} from "lucide-react";

export default function DocumentVaultPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [search, setSearch] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [inspectingDoc, setInspectingDoc] = useState<DocumentItem | null>(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("documind_documents");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) setDocuments(parsed);
      }
    } catch (e) {}
  }, []);

  const saveDocuments = (docs: DocumentItem[]) => {
    setDocuments(docs);
    try {
      localStorage.setItem("documind_documents", JSON.stringify(docs));
    } catch (e) {}
  };

  const filteredDocs = documents.filter((d) => 
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.fileName.toLowerCase().includes(search.toLowerCase())
  );

  const totalChunks = documents.reduce((sum, d) => sum + (d.chunks?.length || 0), 0);
  const totalTokens = documents.reduce((sum, d) => sum + (d.tokenCount || 0), 0);

  const handleDelete = (id: string) => {
    saveDocuments(documents.filter((d) => d.id !== id));
  };

  const handleAddDocument = (newDoc: DocumentItem) => {
    saveDocuments([newDoc, ...documents]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onOpenUpload={() => setIsUploadOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Vector Document Vault
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Manage indexed knowledge bases, inspect 1536-dim embedding chunks, and test similarity recall.
            </p>
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400">Total Indexed Documents</div>
            <div className="text-3xl font-extrabold text-white mt-1.5">{documents.length}</div>
            <div className="text-xs text-cyan-400 mt-1">PDF, Markdown & Text</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400">Embedded Chunks (HNSW)</div>
            <div className="text-3xl font-extrabold text-white mt-1.5">{totalChunks}</div>
            <div className="text-xs text-indigo-400 mt-1">512 token chunk overlap</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400">Corpus Token Size</div>
            <div className="text-3xl font-extrabold text-white mt-1.5">{totalTokens.toLocaleString()}</div>
            <div className="text-xs text-emerald-400 mt-1">text-embedding-3-small</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search documents by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                    {doc.fileSize}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base mt-4">{doc.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">{doc.fileName}</p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Chunks</span>
                    <span className="font-semibold text-slate-200">{doc.chunks?.length || 0} partitions</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Token Count</span>
                    <span className="font-semibold text-slate-200">{(doc.tokenCount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => setInspectingDoc(doc)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition font-medium"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Inspect Chunks</span>
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 transition"
                  title="Remove from vector index"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Modals */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddDocument={handleAddDocument}
      />

      <ChunkInspectorModal
        document={inspectingDoc}
        onClose={() => setInspectingDoc(null)}
      />
    </div>
  );
}
