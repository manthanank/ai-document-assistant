"use client";

import React, { useState } from "react";
import { DocumentItem, DocumentChunk } from "@/lib/types";
import { estimateTokens } from "@/lib/rag-engine";
import { X, Upload, FileText, CheckCircle2, Sparkles } from "lucide-react";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (doc: DocumentItem) => void;
}

export function DocumentUploadModal({
  isOpen,
  onClose,
  onAddDocument,
}: DocumentUploadModalProps) {
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const [chunkSize, setChunkSize] = useState<number>(500);

  const sampleDocText = `Stripe Billing & Payment Intents Lifecycle
The Payment Intents API guides transactions through an explicit state machine: requires_payment_method -> requires_confirmation -> requires_action -> processing -> succeeded.
For 3D Secure 2 (3DS2) authentication, requires_action triggers customer verification prompts without redirecting outside the checkout viewport.
Webhooks listening for payment_intent.succeeded and invoice.payment_failed must verify cryptographic signatures using stripe.webhooks.constructEvent.
Idempotency keys ensure network drops never result in double billing for subscription upgrades.`;

  const handleLoadSample = () => {
    setTitle("Stripe Payment Intents & 3DS2 Lifecycle Specification");
    setFileName("stripe_payment_intents_lifecycle.pdf");
    setContent(sampleDocText);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setContent(text || "Extracted PDF contents ready for vector embedding.");
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const docId = `doc-${Date.now()}`;

    // Chunking algorithm with semantic boundaries
    const sentences = content.split(/(?<=[.?!])\s+/);
    const chunks: DocumentChunk[] = [];
    let currentChunk = "";
    let chunkIndex = 1;

    for (const sentence of sentences) {
      if ((currentChunk + " " + sentence).length > chunkSize && currentChunk.length > 0) {
        chunks.push({
          id: `chunk-${docId}-${chunkIndex}`,
          documentId: docId,
          chunkIndex,
          pageNumber: Math.ceil(chunkIndex / 2),
          content: currentChunk.trim(),
        });
        chunkIndex++;
        currentChunk = sentence;
      } else {
        currentChunk += " " + sentence;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push({
        id: `chunk-${docId}-${chunkIndex}`,
        documentId: docId,
        chunkIndex,
        pageNumber: Math.ceil(chunkIndex / 2),
        content: currentChunk.trim(),
      });
    }

    const totalTokens = estimateTokens(content);

    const newDoc: DocumentItem = {
      id: docId,
      title,
      fileName: fileName || `${title.toLowerCase().replace(/\s+/g, "_")}.pdf`,
      fileSize: `${(content.length / 1024).toFixed(1)} KB`,
      tokenCount: totalTokens,
      uploadedAt: new Date().toISOString().split("T")[0],
      chunks,
    };

    onAddDocument(newDoc);
    setTitle("");
    setFileName("");
    setContent("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload & Chunk Document</h3>
              <p className="text-xs text-slate-400">Extracts text and generates vector embeddings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Sample Button */}
        <div className="flex items-center justify-between p-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-xs">
          <span className="text-cyan-300">Want to test with a technical sample?</span>
          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1 font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Load Sample Whitepaper</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Select Document (PDF / TXT / MD)
            </label>
            <input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-cyan-400 hover:file:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Document Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Database Architecture"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Chunk Size Selector */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Target Chunk Size:</span>
              <span className="font-mono text-cyan-400 font-bold">{chunkSize} chars</span>
            </div>
            <select
              value={chunkSize}
              onChange={(e) => setChunkSize(parseInt(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value={250}>250 chars (Granular sentences)</option>
              <option value={500}>500 chars (Standard RAG paragraphs)</option>
              <option value={1000}>1000 chars (Broad thematic sections)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Document Text *</label>
            <textarea
              rows={4}
              required
              placeholder="Paste or preview document text..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none font-mono"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white border border-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 shadow-md shadow-cyan-600/20"
            >
              Process & Embed Chunks
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

