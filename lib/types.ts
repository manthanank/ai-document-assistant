export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  pageNumber: number;
  similarity?: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  tokenCount: number;
  uploadedAt: string;
  chunks: DocumentChunk[];
}

export interface Citation {
  documentTitle: string;
  pageNumber: number;
  chunkIndex: number;
  snippet: string;
  similarity: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: Citation[];
  tokensUsed?: number;
}

export interface UsageQuota {
  monthlyBudget: number; // e.g. 100,000 tokens
  tokensConsumed: number;
  queriesCount: number;
}

