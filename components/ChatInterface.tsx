"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, DocumentItem, Citation } from "@/lib/types";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Bookmark,
  ExternalLink,
  Loader2,
  Cpu,
} from "lucide-react";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  documents: DocumentItem[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onSelectCitation: (citation: Citation) => void;
}

export function ChatInterface({
  messages,
  documents,
  onSendMessage,
  isLoading,
  onSelectCitation,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const quickQuestions = [
    "How do Server Actions work in Next.js 15?",
    "Explain HMAC webhook signature verification",
    "What are the benchmarks for pgvector HNSW?",
    "What are the caching changes in Next.js 15?",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col h-full backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Semantic Document Chat</span>
              <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.2 rounded-full">
                RAG Engine
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Contextual answers grounded in your PDF chunks</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Cpu className="h-3.5 w-3.5 text-cyan-400" />
          <span>text-embedding-3-small</span>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-2 border-b border-slate-800/60 bg-slate-950/40 flex gap-1.5 overflow-x-auto scrollbar-none">
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(q)}
            disabled={isLoading}
            className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-grow p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[500px] text-xs sm:text-sm">
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="h-7 w-7 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`rounded-2xl p-4 max-w-[85%] sm:max-w-[78%] leading-relaxed ${
                  isUser
                    ? "bg-cyan-600 text-white rounded-tr-none shadow-md shadow-cyan-600/10"
                    : "bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none space-y-3"
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Citations List */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2.5 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                      Source Citations (Grounded Context):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cite, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSelectCitation(cite)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-[11px] font-mono text-cyan-300 transition-colors cursor-pointer"
                        >
                          <Bookmark className="h-3 w-3 text-cyan-400" />
                          <span className="truncate max-w-[140px]">{cite.documentTitle}</span>
                          <span className="text-slate-500">p.{cite.pageNumber}</span>
                          <span className="text-emerald-400 font-bold">
                            {(cite.similarity * 100).toFixed(0)}% match
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-10">
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
            <span>Scanning pgvector embeddings and generating grounded answer...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/90 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question across your indexed documents..."
          disabled={isLoading}
          className="flex-grow rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/20 disabled:opacity-50 cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
}

