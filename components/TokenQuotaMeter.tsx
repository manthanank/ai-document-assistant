"use client";

import React from "react";
import { UsageQuota } from "@/lib/types";
import { Zap, Cpu, Activity, Clock } from "lucide-react";

interface TokenQuotaMeterProps {
  quota: UsageQuota;
}

export function TokenQuotaMeter({ quota }: TokenQuotaMeterProps) {
  const percentUsed = Math.min(
    100,
    Math.round((quota.tokensConsumed / quota.monthlyBudget) * 100)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Monthly Budget Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Monthly Token Allowance</span>
          <Zap className="h-4 w-4 text-amber-400" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-white">
          {(quota.monthlyBudget - quota.tokensConsumed).toLocaleString()}{" "}
          <span className="text-xs font-normal text-slate-500">tokens left</span>
        </div>
        {/* Progress bar */}
        <div className="mt-2.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
            style={{ width: `${100 - percentUsed}%` }}
          />
        </div>
      </div>

      {/* Tokens Consumed Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Tokens Consumed</span>
          <Cpu className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
          {quota.tokensConsumed.toLocaleString()}{" "}
          <span className="text-xs font-normal text-slate-500">({percentUsed}%)</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Estimated at ~${((quota.tokensConsumed / 1000) * 0.0015).toFixed(3)} compute cost
        </p>
      </div>

      {/* Query Volume Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Semantic Queries</span>
          <Activity className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
          {quota.queriesCount}{" "}
          <span className="text-xs font-normal text-slate-500">queries executed</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Average latency: 28ms (pgvector HNSW)</p>
      </div>
    </div>
  );
}

