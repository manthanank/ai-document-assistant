"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { 
  BarChart2, Zap, Clock, ShieldCheck, ArrowUpRight, 
  Database, Cpu, CheckCircle2 
} from "lucide-react";

export default function AnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const tokenUsageData = [
    { day: "Mon", promptTokens: 4200, completionTokens: 1800, total: 6000 },
    { day: "Tue", promptTokens: 6800, completionTokens: 2400, total: 9200 },
    { day: "Wed", promptTokens: 8100, completionTokens: 3100, total: 11200 },
    { day: "Thu", promptTokens: 5900, completionTokens: 2200, total: 8100 },
    { day: "Fri", promptTokens: 9400, completionTokens: 3900, total: 13300 },
    { day: "Sat", promptTokens: 3100, completionTokens: 1200, total: 4300 },
    { day: "Sun", promptTokens: 4900, completionTokens: 1900, total: 6800 },
  ];

  const latencyP99Data = [
    { category: "Chunk Embedding", latencyMs: 14, fill: "#06b6d4" },
    { category: "pgvector HNSW Recall", latencyMs: 8, fill: "#3b82f6" },
    { category: "Reranker Cross-Encoder", latencyMs: 12, fill: "#6366f1" },
    { category: "LLM First Token TTFT", latencyMs: 45, fill: "#10b981" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              RAG Performance & Token Analytics
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Monitor embedding throughput, pgvector HNSW recall latency, and token consumption efficiency.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Mean Response Latency: 79ms</span>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Queries Handled", val: "1,420", change: "+24.5%", sub: "this month" },
            { label: "Avg Context Similarity", val: "0.892", change: "+0.04", sub: "Cosine score" },
            { label: "Token Efficiency", val: "94.8%", change: "+3.2%", sub: "Prompt chunking ratio" },
            { label: "HNSW Recall Latency", val: "8.2ms", change: "-1.4ms", sub: "Index p95" }
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800"
            >
              <div className="text-xs font-semibold text-slate-400">{item.label}</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">{item.val}</div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-cyan-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{item.change}</span>
                <span className="text-slate-500 text-[11px] font-normal">({item.sub})</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Token Usage Curve */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white">Daily Token Consumption Trends</h3>
              <p className="text-xs text-slate-400">Prompt context window tokens vs LLM synthesized response tokens</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded bg-cyan-500" /> Prompt Tokens
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded bg-blue-500" /> Completion Tokens
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tokenUsageData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="promptGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                  />
                  <Area type="monotone" dataKey="promptTokens" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#promptGrad)" />
                  <Area type="monotone" dataKey="completionTokens" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#compGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Latency Breakdown Bar */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">RAG Sub-System Latency Profiling (Milliseconds)</h3>
            <p className="text-xs text-slate-400">Microsecond breakdown of vector embedding, HNSW nearest-neighbor search, and LLM generation</p>
          </div>

          <div className="h-64 w-full pt-4">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latencyP99Data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <XAxis type="number" stroke="#64748b" fontSize={11} unit="ms" />
                  <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={12} width={180} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                    formatter={(val) => [`${val} ms`, "Latency"]}
                  />
                  <Bar dataKey="latencyMs" radius={[0, 8, 8, 0]}>
                    {latencyP99Data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

