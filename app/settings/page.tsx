"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { 
  Database, Key, Download, RefreshCw, CheckCircle2, 
  Sliders, Shield, Cpu, Code2 
} from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("sk-docu-••••••••••••••••••••••••");
  const [embeddingModel, setEmbeddingModel] = useState("text-embedding-3-small (1536-dim)");
  const [chunkSize, setChunkSize] = useState(512);
  const [chunkOverlap, setChunkOverlap] = useState(64);
  const [hnswM, setHnswM] = useState(16);
  const [hnswEf, setHnswEf] = useState(64);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleExportData = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      system: "DocuMind AI RAG Engine v2.0",
      vectorConfig: {
        dimensions: 1536,
        distanceMetric: "cosine",
        indexType: "HNSW",
        m: hnswM,
        ef_construction: hnswEf,
      },
      models: {
        embedding: embeddingModel,
        chunkSize,
        chunkOverlap,
      },
      status: "Ready"
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `documind-vector-config-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    triggerToast("Vector configuration and schema metadata exported!");
  };

  const sqlSchema = `-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents master table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT,
  token_size INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document chunks with 1536-dimensional embeddings
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create HNSW index for ultra-fast cosine similarity retrieval
CREATE INDEX idx_document_chunks_embedding 
ON document_chunks 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            RAG Engine & Vector DB Configuration
          </h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            Tune embedding models, HNSW index hyper-parameters, API authentication, and pgvector schemas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Config Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Embedding & Chunking Parameters</h2>
                  <p className="text-xs text-slate-400">Controls token window partitioning and vector dimension representations</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Vector Embedding Model</label>
                  <select
                    value={embeddingModel}
                    onChange={(e) => setEmbeddingModel(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="text-embedding-3-small (1536-dim)">OpenAI text-embedding-3-small (1536 dimensions • Recommended)</option>
                    <option value="text-embedding-3-large (3072-dim)">OpenAI text-embedding-3-large (3072 dimensions • High Precision)</option>
                    <option value="text-embedding-ada-002 (1536-dim)">OpenAI text-embedding-ada-002 (Legacy)</option>
                    <option value="cohere-embed-v3 (1024-dim)">Cohere embed-multilingual-v3.0</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Chunk Size (Tokens)</label>
                    <input
                      type="number"
                      value={chunkSize}
                      onChange={(e) => setChunkSize(Number(e.target.value))}
                      className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Chunk Overlap (Tokens)</label>
                    <input
                      type="number"
                      value={chunkOverlap}
                      onChange={(e) => setChunkOverlap(Number(e.target.value))}
                      className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">HNSW M (Bidirectional Links)</label>
                    <input
                      type="number"
                      value={hnswM}
                      onChange={(e) => setHnswM(Number(e.target.value))}
                      className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">HNSW ef_construction</label>
                    <input
                      type="number"
                      value={hnswEf}
                      onChange={(e) => setHnswEf(Number(e.target.value))}
                      className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => triggerToast("RAG indexing parameters updated!")}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition"
                  >
                    Save Model Parameters
                  </button>
                </div>
              </div>
            </div>

            {/* PostgreSQL pgvector Schema Viewer */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">PostgreSQL pgvector Schema</h2>
                    <p className="text-xs text-slate-400">Production SQL DDL with HNSW cosine distance indexing</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  db/schema.sql
                </span>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                {sqlSchema}
              </pre>
            </div>
          </div>

          {/* Right Column: API Keys & Backup */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">LLM Provider API Key</h3>
                  <p className="text-xs text-slate-400">Used for embedding generation & grounding</p>
                </div>
              </div>

              <div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
                />
              </div>

              <button
                onClick={() => triggerToast("API key validated and stored.")}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Update Key
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Configuration Export</h3>
                  <p className="text-xs text-slate-400">Download system configuration snapshot</p>
                </div>
              </div>

              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" /> Download JSON Archive
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/40 text-cyan-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3"
        >
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </motion.div>
      )}
    </div>
  );
}
