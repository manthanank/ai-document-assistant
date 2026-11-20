"use client";

import React, { useState, useEffect } from "react";
import {
  INITIAL_DOCUMENTS,
  INITIAL_MESSAGES,
  INITIAL_USAGE,
} from "@/lib/mock-data";
import { DocumentItem, ChatMessage, UsageQuota, Citation } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { TokenQuotaMeter } from "@/components/TokenQuotaMeter";
import { DocumentList } from "@/components/DocumentList";
import { ChatInterface } from "@/components/ChatInterface";
import { DocumentUploadModal } from "@/components/DocumentUploadModal";
import { ChunkInspectorModal } from "@/components/ChunkInspectorModal";
import { CitationDetailModal } from "@/components/CitationDetailModal";
import { Database, Sparkles, ShieldCheck } from "lucide-react";

export default function DocumentAssistantChatPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [quota, setQuota] = useState<UsageQuota>(INITIAL_USAGE);
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [inspectingDoc, setInspectingDoc] = useState<DocumentItem | null>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  // Persistence
  useEffect(() => {
    try {
      const storedDocs = localStorage.getItem("documind_documents");
      if (storedDocs) setDocuments(JSON.parse(storedDocs));

      const storedMsgs = localStorage.getItem("documind_messages");
      if (storedMsgs) setMessages(JSON.parse(storedMsgs));

      const storedQuota = localStorage.getItem("documind_quota");
      if (storedQuota) setQuota(JSON.parse(storedQuota));
    } catch (e) {
      // Fallback silently to mock state
    }
  }, []);

  const saveDocuments = (newDocs: DocumentItem[]) => {
    setDocuments(newDocs);
    try {
      localStorage.setItem("documind_documents", JSON.stringify(newDocs));
    } catch (e) {}
  };

  const saveMessages = (newMsgs: ChatMessage[]) => {
    setMessages(newMsgs);
    try {
      localStorage.setItem("documind_messages", JSON.stringify(newMsgs));
    } catch (e) {}
  };

  const saveQuota = (newQuota: UsageQuota) => {
    setQuota(newQuota);
    try {
      localStorage.setItem("documind_quota", JSON.stringify(newQuota));
    } catch (e) {}
  };

  // Handlers
  const handleAddDocument = (newDoc: DocumentItem) => {
    const updated = [newDoc, ...documents];
    saveDocuments(updated);
  };

  const handleDeleteDocument = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    saveDocuments(updated);
    if (inspectingDoc?.id === id) setInspectingDoc(null);
  };

  const handleSendMessage = async (queryText: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: queryText,
      timestamp: new Date().toISOString(),
    };

    const updatedWithUser = [...messages, userMsg];
    setMessages(updatedWithUser);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText, documents }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: data.answer || "No relevant document chunks found.",
        citations: data.citations || [],
        tokensUsed: data.tokensUsed || 300,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedWithUser, assistantMsg];
      saveMessages(finalMessages);

      // Update quota
      const updatedQuota: UsageQuota = {
        monthlyBudget: quota.monthlyBudget,
        tokensConsumed: quota.tokensConsumed + (data.tokensUsed || 350),
        queriesCount: quota.queriesCount + 1,
      };
      saveQuota(updatedQuota);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Error querying vector embeddings. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages([...updatedWithUser, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        quota={quota}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-6">
        {/* pgvector Banner */}
        <div className="p-3 sm:p-4 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Database className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="font-semibold text-white">pgvector HNSW Index Active</span>:{" "}
              <span className="text-slate-400">
                1536-dimensional embeddings with sub-35ms cosine distance recall.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] self-end sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>RAG Document Q&A Studio</span>
          </div>
        </div>

        {/* Token Quota Meter */}
        <TokenQuotaMeter quota={quota} />

        {/* Split Grid: Knowledge Base (left) and Chat (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
          <div className="lg:col-span-4 h-full">
            <DocumentList
              documents={documents}
              onInspectDocument={(doc) => setInspectingDoc(doc)}
              onDeleteDocument={handleDeleteDocument}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          </div>

          <div className="lg:col-span-8 h-full">
            <ChatInterface
              messages={messages}
              documents={documents}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onSelectCitation={(cite) => setActiveCitation(cite)}
            />
          </div>
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

      <CitationDetailModal
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
      />
    </div>
  );
}

