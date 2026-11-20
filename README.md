# DocuMind AI — AI-Powered Document Assistant

> Enterprise RAG document intelligence platform with PDF chunking, pgvector HNSW indexing, conversational semantic chat, source citations, and token budget limits.

Part of the **10-Project Full-Stack Suite** by [Manthan Ank](https://github.com/manthanank).

---

## 🚀 Key Features & Capabilities

- **Dynamic Vector Vault API (`/api/documents`)**: Server-backed document ingestion, text chunking, and token estimation REST API route with dynamic relative date indexing.
- **RAG Document Engine**: Semantic question answering grounded strictly in uploaded documents, eliminating hallucinations.
- **Automated Text Chunking**: Drag-and-drop file upload with recursive semantic boundary chunking and configurable chunk sizes (250, 500, 1000 characters).
- **Chunk Inspector**: Detailed view into every indexed chunk with page number, chunk index, character length, and raw text.
- **Source Citation Pills**: Assistant responses include clickable source citations showing the exact document title, page number, and similarity match percentage.
- **pgvector HNSW Architecture**: Production SQL schema (`db/schema.sql`) with 1536-dimensional embeddings and logarithmic HNSW graph search.
- **Token Allowance & Usage Quotas**: Real-time token usage meter tracking monthly consumption, remaining budget, and queries count.
- **Zero-Config Offline Mode**: Preloaded with 3 technical whitepapers (Next.js 15, Webhook Security, pgvector Benchmarks) for immediate testing.
- **Observability**: Built-in `@vercel/analytics` and `@vercel/speed-insights`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons, Framer Motion
- **Vector DB**: PostgreSQL (`pgvector` with HNSW index)
- **Deployment**: Vercel

---

## 📦 Getting Started

1. Navigate to the project directory:
   ```bash
   cd c:\Users\manth\projects\ai-document-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure OpenAI API key in `.env.local`:
   ```bash
   OPENAI_API_KEY=sk-...
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

