import { DocumentItem, ChatMessage, UsageQuota } from "./types";

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-1",
    title: "Next.js 15 App Router & Server Actions Architecture",
    fileName: "nextjs15_technical_whitepaper.pdf",
    fileSize: "1.4 MB",
    tokenCount: 4200,
    uploadedAt: "2026-11-18",
    chunks: [
      {
        id: "chunk-1-1",
        documentId: "doc-1",
        chunkIndex: 1,
        pageNumber: 2,
        content:
          "Next.js 15 App Router standardizes React Server Components (RSC) by default. RSCs execute strictly on the server during the build or request lifecycle, streaming HTML fragments to the client via React's Suspense boundary without transmitting JavaScript bundle weight for static view logic.",
      },
      {
        id: "chunk-1-2",
        documentId: "doc-1",
        chunkIndex: 2,
        pageNumber: 4,
        content:
          "Server Actions in Next.js 15 replace legacy API route mutation pipelines. Annotated with 'use server', they allow asynchronous functions to be invoked directly from client components or HTML forms, featuring automated CSRF tokens, progressive enhancement, and instant revalidation through revalidatePath and revalidateTag.",
      },
      {
        id: "chunk-1-3",
        documentId: "doc-1",
        chunkIndex: 3,
        pageNumber: 7,
        content:
          "Caching semantics in Next.js 15 require explicit opting. Unlike Next.js 14, fetch requests are un-cached by default unless cache: 'force-cache' or next: { revalidate: N } is specified. This eliminates stale data surprises during database mutations and high-velocity transactional workloads.",
      },
    ],
  },
  {
    id: "doc-2",
    title: "Distributed Systems Idempotency & Webhook Security Guide",
    fileName: "webhook_security_and_idempotency.pdf",
    fileSize: "840 KB",
    tokenCount: 3100,
    uploadedAt: "2026-11-15",
    chunks: [
      {
        id: "chunk-2-1",
        documentId: "doc-2",
        chunkIndex: 1,
        pageNumber: 1,
        content:
          "Webhook listeners in production must verify cryptographic HMAC signatures transmitted in request headers (e.g., stripe-signature or x-hub-signature-256). The raw request body must be read as an unmodified buffer before JSON parsing to avoid signature calculation mismatches caused by whitespace normalization.",
      },
      {
        id: "chunk-2-2",
        documentId: "doc-2",
        chunkIndex: 2,
        pageNumber: 3,
        content:
          "Idempotency keys prevent double-charge scenarios during network partition retries. When a checkout transaction is initiated, an idempotency key (UUIDv4) is recorded in PostgreSQL within a serializable transaction. Duplicate incoming payloads bearing the identical key immediately return the cached completed state without re-executing credit card captures.",
      },
    ],
  },
  {
    id: "doc-3",
    title: "pgvector & HNSW Vector Indexing Benchmarks",
    fileName: "pgvector_hnsw_benchmarks.pdf",
    fileSize: "1.8 MB",
    tokenCount: 5600,
    uploadedAt: "2026-11-10",
    chunks: [
      {
        id: "chunk-3-1",
        documentId: "doc-3",
        chunkIndex: 1,
        pageNumber: 2,
        content:
          "HNSW (Hierarchical Navigable Small World) indexes in pgvector provide logarithmic search complexity for high-dimensional embeddings (1536d for OpenAI text-embedding-3-small). When configured with m = 16 and ef_construction = 64, queries achieve sub-35ms recall over 100,000 document vectors with 98.4% recall accuracy compared to exhaustive flat scans.",
      },
      {
        id: "chunk-3-2",
        documentId: "doc-3",
        chunkIndex: 2,
        pageNumber: 5,
        content:
          "Cosine distance (<=>) measures angular similarity rather than magnitude, making it ideal for normalized text embeddings. Storing vectors inside PostgreSQL eliminates the architectural overhead of operating a separate third-party vector store, ensuring ACID compliance and joint relational filtering in a single query.",
      },
    ],
  },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content:
      "Hello! I am your AI Document Assistant. I have indexed 3 technical whitepapers in your vector store (Next.js 15, Webhook Security & Idempotency, and pgvector Benchmarks).\n\nAsk me anything about these documents or drag-and-drop a new PDF to extract and query its chunks!",
    timestamp: "2026-11-20T12:00:00Z",
  },
];

export const INITIAL_USAGE: UsageQuota = {
  monthlyBudget: 100000,
  tokensConsumed: 18450,
  queriesCount: 24,
};

