-- ========================================================
-- AI-POWERED DOCUMENT ASSISTANT - PGVECTOR SCHEMA
-- Implements HNSW Cosine Distance Indexing for Sub-50ms RAG
-- ========================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Documents Master Table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INT NOT NULL,
  token_count INT DEFAULT 0,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Document Chunks with Vector Embeddings (1536 dimensions for text-embedding-3-small)
CREATE TABLE IF NOT EXISTS public.document_chunks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  page_number INT DEFAULT 1,
  token_length INT NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HNSW Index for ultra-fast approximate nearest neighbor vector search
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding 
ON public.document_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 5. User Usage Quotas
CREATE TABLE IF NOT EXISTS public.usage_quotas (
  user_id UUID PRIMARY KEY,
  monthly_budget_tokens INT DEFAULT 100000,
  tokens_consumed INT DEFAULT 0,
  last_query_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Semantic Similarity Query Procedure
CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  target_document_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  chunk_index INT,
  content TEXT,
  page_number INT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.chunk_index,
    dc.content,
    dc.page_number,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM public.document_chunks dc
  WHERE (target_document_id IS NULL OR dc.document_id = target_document_id)
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

