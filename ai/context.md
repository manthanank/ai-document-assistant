# DocuMind AI - AI-Powered Document Assistant System Context

This document provides system context, vector indexing models, and architectural specifications for AI assistants working on DocuMind AI.

---

## 1. Project Overview
- **Project**: AI-Powered Document Assistant (Project 04 of the 10-Project Full-Stack Suite)
- **Author**: Manthan Ank
- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: Strict TypeScript
- **Vector Database**: PostgreSQL with `pgvector` extension and HNSW approximate nearest neighbor index
- **Chunking Pipeline**: Recursive overlap chunking (default 500 characters, ~120 tokens)
- **Observability**: `@vercel/analytics` and `@vercel/speed-insights`
- **Styling**: Tailwind CSS (dark mode theme) with Framer Motion animations

---

## 2. Core Modules & Relational Models
- `db/schema.sql`: PostgreSQL schema (`documents`, `document_chunks`, `usage_quotas`) with vector cosine ops (`<=>`) and HNSW index.
- `lib/types.ts`: TypeScript contracts for `DocumentItem`, `DocumentChunk`, `Citation`, `ChatMessage`, `UsageQuota`.
- `lib/mock-data.ts`: Preloaded technical documents (Next.js 15, Webhook Security, pgvector Benchmarks) for zero-config offline demonstration.
- `lib/rag-engine.ts`: Semantic similarity scoring, token calculation, and citation extraction.
- `components/DocumentUploadModal.tsx`: File upload, text extraction, and automated chunking with customizable granularity.
- `components/ChatInterface.tsx`: Document Q&A with source citation pills and fast recall.

---

## 3. Responsive Principles
- Desktop/Tablet: Split pane with Document Explorer / Chunk Inspector on the left (4 cols) and Chat Interface on the right (8 cols).
- Mobile: Stacked layout with collapsible document manager drawer and full-screen touch chat interface.

