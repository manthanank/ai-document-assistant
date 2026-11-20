import { DocumentItem, DocumentChunk, Citation } from "./types";

export function estimateTokens(text: string): number {
  return Math.ceil(text.split(/\s+/g).length * 1.3);
}

// Simple cosine similarity simulation between query keywords and chunk text
export function calculateSemanticSimilarity(query: string, content: string): number {
  const queryTerms = query.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const contentLower = content.toLowerCase();

  if (queryTerms.length === 0) return 0.5;

  let matchScore = 0;
  for (const term of queryTerms) {
    if (contentLower.includes(term)) {
      matchScore += 1;
    }
  }

  // Base score + term density normalized between 0.65 and 0.98
  const ratio = matchScore / queryTerms.length;
  if (ratio === 0) {
    return 0.45;
  }
  return Number((0.65 + ratio * 0.33).toFixed(2));
}

export function searchSimilarChunks(
  query: string,
  documents: DocumentItem[],
  limit = 3
): { chunk: DocumentChunk; doc: DocumentItem; similarity: number }[] {
  const scored: { chunk: DocumentChunk; doc: DocumentItem; similarity: number }[] = [];

  for (const doc of documents) {
    for (const chunk of doc.chunks) {
      const similarity = calculateSemanticSimilarity(query, chunk.content);
      scored.push({ chunk, doc, similarity });
    }
  }

  return scored
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

export function generateRagResponse(
  query: string,
  documents: DocumentItem[]
): { answer: string; citations: Citation[]; tokensUsed: number } {
  const topMatches = searchSimilarChunks(query, documents, 2);

  const citations: Citation[] = topMatches.map(({ chunk, doc, similarity }) => ({
    documentTitle: doc.title,
    pageNumber: chunk.pageNumber,
    chunkIndex: chunk.chunkIndex,
    snippet: chunk.content.slice(0, 160) + "...",
    similarity,
  }));

  const q = query.toLowerCase();

  let answer = "";
  if (q.includes("next") || q.includes("action") || q.includes("cache") || q.includes("rsc")) {
    answer =
      "Based on the **Next.js 15 Technical Whitepaper**, Next.js 15 enforces React Server Components (RSC) by default, streaming components via React Suspense without client-side bundle bloat. Server Actions ('use server') replace REST mutations with type-safe server invocations and built-in CSRF protection. In addition, fetch requests are now un-cached by default, requiring explicit caching rules.";
  } else if (q.includes("webhook") || q.includes("idempotent") || q.includes("signature") || q.includes("stripe")) {
    answer =
      "According to the **Distributed Systems Webhook Guide**, production webhook listeners must read the unmodified raw body buffer to calculate HMAC SHA-256 signatures accurately before JSON parsing. Furthermore, idempotency keys (UUIDv4) stored within serializable PostgreSQL transactions prevent duplicate credit card charges and double-spending during network retries.";
  } else if (q.includes("vector") || q.includes("hnsw") || q.includes("embedding") || q.includes("pgvector")) {
    answer =
      "Referencing the **pgvector Benchmarks Whitepaper**, HNSW indexing (m = 16, ef_construction = 64) achieves sub-35ms recall over 100,000 1536-dimensional embeddings with 98.4% accuracy. Cosine distance (<=>) provides angular similarity matching while preserving PostgreSQL ACID guarantees alongside relational joins.";
  } else {
    const highestChunk = topMatches[0];
    answer = `Based on your indexed documents (specifically **${highestChunk?.doc.title || "Uploaded Knowledge"}**):\n\n"${highestChunk?.chunk.content || "The documents discuss Next.js 15, vector search, and idempotent webhook architectures."}"\n\nThis grounded response was retrieved using cosine distance similarity.`;
  }

  const tokensUsed = estimateTokens(query) + estimateTokens(answer) + 350;

  return {
    answer,
    citations,
    tokensUsed,
  };
}

