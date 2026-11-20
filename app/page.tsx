"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileText, Sparkles, Database, Search, ArrowRight, 
  CheckCircle2, ChevronRight, Layers, ShieldCheck, Zap, 
  HelpCircle, Code2, ExternalLink, Cpu, Sliders 
} from "lucide-react";

export default function DocumentAssistantLandingPage() {
  // Interactive Vector Similarity Simulator
  const [selectedQuery, setSelectedQuery] = useState(0);

  const demoQueries = [
    {
      q: "What is the policy for processing customer refunds and dispute windows?",
      topChunk: {
        doc: "Billing & Refund Policies v3.4.pdf",
        similarity: 0.942,
        text: "Refund requests submitted within 14 calendar days of annual renewal are eligible for a prorated refund minus transaction processing fees. Disputes must be filed through the customer portal within 30 days.",
      },
      answer: "Customers are eligible for a prorated refund if requested within 14 calendar days of annual renewal. All disputes must be logged through the billing portal within 30 days."
    },
    {
      q: "How are customer API keys and secrets encrypted in the database?",
      topChunk: {
        doc: "Enterprise Security Architecture & SOC2.md",
        similarity: 0.915,
        text: "All customer credentials and API keys are encrypted at rest using AES-256-GCM envelope encryption. Master keys are rotated every 90 days via AWS KMS with strict IAM audit trails.",
      },
      answer: "All API keys and secrets are encrypted at rest using AES-256-GCM envelope encryption, with master keys rotated automatically every 90 days via hardware KMS."
    },
    {
      q: "What are the requirements for configuring Okta SAML 2.0 Single Sign-On?",
      topChunk: {
        doc: "Identity & Access Management Guide.pdf",
        similarity: 0.887,
        text: "SAML 2.0 integration requires an Identity Provider metadata XML file, SHA-256 certificate signing, and assertion consumer service (ACS) endpoint configuration in your IdP console.",
      },
      answer: "Configuring Okta SAML 2.0 requires uploading the IdP metadata XML, applying SHA-256 signing certificates, and binding the ACS endpoint specified in settings."
    }
  ];

  const currentDemo = demoQueries[selectedQuery];

  // Pricing Toggle
  const [annualBilling, setAnnualBilling] = useState(true);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does DocuMind AI prevent hallucinations?",
      a: "DocuMind enforces strict retrieval-augmented grounding. Responses are generated exclusively from high-cosine-similarity chunks retrieved from your private PostgreSQL pgvector database, and every sentence includes verifiable citation chips linking directly to the source text."
    },
    {
      q: "What vector index algorithm is utilized?",
      a: "We utilize PostgreSQL pgvector with Hierarchical Navigable Small World (HNSW) graph indexing with vector_cosine_ops. This delivers sub-35ms recall latencies even across hundreds of thousands of document embeddings."
    },
    {
      q: "Can I connect my own PostgreSQL database?",
      a: "Yes! DocuMind comes with a complete db/schema.sql definition that runs on Supabase, Neon, AWS Aurora PostgreSQL, or local Docker containers."
    },
    {
      q: "What document formats are supported for ingestion?",
      a: "DocuMind natively ingests PDF files, Markdown (.md), plain text (.txt), and technical documentation repositories with automatic chunk partitioning and token counting."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight">DocuMind AI</span>
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                pgvector HNSW
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#simulator" className="hover:text-white transition">RAG Simulator</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#architecture" className="hover:text-white transition">pgvector Schema</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 transition hover:scale-105 active:scale-95"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-24 sm:space-y-32 py-12">
        {/* HERO SECTION */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Production-Grade Retrieval-Augmented Generation</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight sm:leading-[1.1]"
          >
            Chat with Your Documents. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Zero Hallucinations. Pure Grounding.
            </span>
          </motion.h1>

          <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Enterprise document intelligence powered by Next.js 15, PostgreSQL pgvector HNSW indexing, 1536-dimensional embeddings, and verified citation chunk traceability.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/chat"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 transition hover:scale-105 active:scale-95"
            >
              <FileText className="w-5 h-5" />
              <span>Open Document Chat Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/documents"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm transition"
            >
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Explore Vector Vault</span>
            </Link>
          </div>

          {/* Social Proof Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            {[
              { val: "1536-dim", label: "Dense Embeddings", sub: "OpenAI text-embedding-3" },
              { val: "< 35ms", label: "HNSW Vector Recall", sub: "Cosine similarity search" },
              { val: "100%", label: "Source Traceability", sub: "Exact chunk citation pills" },
              { val: "Postgres", label: "pgvector Native", sub: "Fully self-hostable SQL" }
            ].map((stat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                <div className="text-2xl sm:text-3xl font-black text-white">{stat.val}</div>
                <div className="text-xs font-bold text-cyan-400 mt-1">{stat.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE VECTOR SIMULATOR */}
        <section id="simulator" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Search className="w-3.5 h-3.5" />
              <span>Live Semantic Search & Cosine Scoring</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Interactive RAG Similarity Simulator</h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Select a natural-language query to see how the vector engine finds the closest chunk and synthesizes a grounded answer.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Query Selector Tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {demoQueries.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedQuery(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                    selectedQuery === idx
                      ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30 font-semibold"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Query #{idx + 1}: {item.q.slice(0, 36)}...
                </button>
              ))}
            </div>

            {/* Interactive Showcase Card */}
            <motion.div
              key={selectedQuery}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-2xl"
            >
              {/* Question */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">User Query</span>
                <p className="text-base sm:text-lg font-bold text-white">"{currentDemo.q}"</p>
              </div>

              {/* Retrieved Chunk with Similarity Score */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                    <Database className="w-4 h-4" />
                    <span>Top Retrieved Chunk: {currentDemo.topChunk.doc}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold">
                    <span>Cosine Similarity: {(currentDemo.topChunk.similarity * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  "{currentDemo.topChunk.text}"
                </p>
              </div>

              {/* Synthesized Answer */}
              <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-800/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <Sparkles className="w-4 h-4" />
                  <span>Grounded LLM Response</span>
                </div>
                <p className="text-sm text-cyan-100 leading-relaxed font-medium">
                  {currentDemo.answer}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CORE WORKSPACE MODULES */}
        <section id="features" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Enterprise RAG Infrastructure</h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Everything required to ingest, embed, index, query, and audit your knowledge assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                title: "Conversational Studio",
                desc: "Real-time streaming Q&A with multi-turn context and clickable chunk citations.",
                href: "/chat",
                action: "Open Studio"
              },
              {
                icon: Layers,
                title: "Vector Vault & Chunks",
                desc: "Inspect chunk splits, token lengths, and raw embeddings for every document.",
                href: "/documents",
                action: "Browse Vault"
              },
              {
                icon: Database,
                title: "pgvector HNSW Recall",
                desc: "PostgreSQL native vector index with sub-35ms cosine distance queries.",
                href: "/settings",
                action: "Inspect Schema"
              },
              {
                icon: Zap,
                title: "Token & Latency Metrics",
                desc: "Monitor prompt vs completion token consumption and p99 recall latency.",
                href: "/analytics",
                action: "View Analytics"
              }
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-white text-base mt-4">{f.title}</h3>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{f.desc}</p>
                  </div>

                  <Link
                    href={f.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 pt-2"
                  >
                    <span>{f.action}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* POSTGRESQL PGVECTOR ARCHITECTURE */}
        <section id="architecture" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  SQL DDL • PostgreSQL 16 + pgvector
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Production pgvector Database Schema</h2>
                <p className="text-slate-400 text-sm max-w-2xl">
                  Built-in vector cosine ops with Hierarchical Navigable Small World graphs for ultra-fast vector retrieval.
                </p>
              </div>

              <Link
                href="/settings"
                className="self-start lg:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Configure Index & Keys</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {[
                { name: "documents", desc: "Master metadata, token count, upload timestamps" },
                { name: "document_chunks", desc: "Text segments with 1536-dimensional vector columns" },
                { name: "HNSW Index", desc: "m=16, ef_construction=64 cosine distance graph" },
                { name: "Citations Engine", desc: "Deterministic chunk IDs linked to responses" }
              ].map((m) => (
                <div key={m.name} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                  <div className="font-mono font-bold text-cyan-400">{m.name}</div>
                  <div className="text-slate-400 text-[11px] leading-relaxed">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING MATRIX */}
        <section id="pricing" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Predictable Capacity Pricing</h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Scale from individual research desks to organization-wide document vaults.
            </p>

            <div className="inline-flex items-center gap-3 p-1 rounded-full bg-slate-900 border border-slate-800 mt-4">
              <button
                onClick={() => setAnnualBilling(false)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${!annualBilling ? "bg-cyan-600 text-white" : "text-slate-400"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnualBilling(true)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${annualBilling ? "bg-cyan-600 text-white" : "text-slate-400"}`}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Developer Free",
                price: "$0",
                period: "forever free",
                features: [
                  "100,000 monthly token quota",
                  "Up to 25 indexed documents",
                  "pgvector HNSW local indexing",
                  "Verifiable chunk citations"
                ],
                popular: false,
                btn: "Start Free",
                href: "/chat"
              },
              {
                name: "Pro Research",
                price: annualBilling ? "$24" : "$29",
                period: "per month, billed annually",
                features: [
                  "1,000,000 monthly token quota",
                  "Unlimited indexed documents",
                  "Multi-format ingestion (PDF, MD, Docx)",
                  "Custom HNSW hyperparameter tuning",
                  "Latency & token analytics suite"
                ],
                popular: true,
                btn: "Launch Pro Workspace",
                href: "/chat"
              },
              {
                name: "Enterprise Dedicated",
                price: annualBilling ? "$79" : "$99",
                period: "per month, billed annually",
                features: [
                  "5,000,000 monthly token quota",
                  "Dedicated pgvector cluster isolation",
                  "Custom embedding model endpoints",
                  "SSO SAML / Okta authentication",
                  "SOC2 Type II compliance reports"
                ],
                popular: false,
                btn: "Contact Enterprise",
                href: "/chat"
              }
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-3xl border flex flex-col justify-between space-y-6 transition ${
                  plan.popular
                    ? "bg-slate-900 border-cyan-500 shadow-2xl shadow-cyan-500/10 scale-105"
                    : "bg-slate-900/50 border-slate-800"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white text-lg">{plan.name}</h3>
                    {plan.popular && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400">/{plan.period}</span>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={plan.href}
                  className={`w-full py-3 rounded-xl font-bold text-xs text-center transition ${
                    plan.popular
                      ? "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  }`}
                >
                  {plan.btn}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-sm">Everything you need to know about DocuMind AI and pgvector retrieval.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-800 rounded-2xl bg-slate-900/50 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-white hover:text-cyan-400 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? "rotate-90 text-cyan-400" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-cyan-900/50 via-slate-900 to-blue-950/50 border border-cyan-500/30 text-center space-y-6 shadow-2xl">
            <h2 className="text-3xl sm:text-5xl font-black text-white max-w-2xl mx-auto leading-tight">
              Ready to Query Your Knowledge Base with Precision?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Upload your documents and experience instant semantic search with verifiable source citations.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/chat"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 transition hover:scale-105"
              >
                Launch Document Studio
              </Link>
              <Link
                href="/documents"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-sm transition"
              >
                Explore Vector Vault
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
              <FileText className="h-4 w-4" />
            </div>
            <span className="font-bold text-white text-sm">DocuMind AI</span>
            <span>• PostgreSQL pgvector RAG Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/chat" className="hover:text-slate-300 transition">Chat Studio</Link>
            <Link href="/documents" className="hover:text-slate-300 transition">Vector Vault</Link>
            <Link href="/analytics" className="hover:text-slate-300 transition">Latency Analytics</Link>
            <Link href="/settings" className="hover:text-slate-300 transition">Settings</Link>
            <a href="https://github.com/manthanank/ai-document-assistant" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition flex items-center gap-1">
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            © {new Date().getFullYear()} DocuMind AI. Grounded vector intelligence.
          </div>
        </div>
      </footer>
    </div>
  );
}
