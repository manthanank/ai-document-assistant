import { NextResponse } from "next/server";
import { DocumentItem, DocumentChunk } from "@/lib/types";

function generateDynamicDocuments(): DocumentItem[] {
  const now = new Date();
  const relDate = (daysAgo: number) => {
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return d.toISOString().split("T")[0];
  };

  return [
    {
      id: "doc-1",
      title: "Next.js 15 App Router & Server Actions Architecture",
      fileName: "nextjs15_technical_whitepaper.pdf",
      fileSize: "1.4 MB",
      tokenCount: 4200,
      uploadedAt: relDate(1),
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
      ],
    },
    {
      id: "doc-2",
      title: "Distributed Systems Idempotency & Webhook Security Guide",
      fileName: "webhook_security_and_idempotency.pdf",
      fileSize: "840 KB",
      tokenCount: 3100,
      uploadedAt: relDate(3),
      chunks: [
        {
          id: "chunk-2-1",
          documentId: "doc-2",
          chunkIndex: 1,
          pageNumber: 1,
          content:
            "Webhook listeners in production must verify cryptographic HMAC signatures transmitted in request headers (e.g., stripe-signature or x-hub-signature-256). The raw request body must be read as an unmodified buffer before JSON parsing to avoid signature calculation mismatches.",
        },
      ],
    },
    {
      id: "doc-3",
      title: "Vector Search pgvector HNSW Indexing Strategy",
      fileName: "pgvector_hnsw_indexes.pdf",
      fileSize: "620 KB",
      tokenCount: 2400,
      uploadedAt: relDate(6),
      chunks: [
        {
          id: "chunk-3-1",
          documentId: "doc-3",
          chunkIndex: 1,
          pageNumber: 1,
          content:
            "Hierarchical Navigable Small World (HNSW) graphs in pgvector achieve logarithmic query complexity with near-perfect cosine similarity recall compared to inverted file flat (IVFFlat) indexes.",
        },
      ],
    },
  ];
}

let serverDocs: DocumentItem[] = generateDynamicDocuments();

export async function GET() {
  const totalTokens = serverDocs.reduce((acc, d) => acc + d.tokenCount, 0);
  const totalChunks = serverDocs.reduce((acc, d) => acc + d.chunks.length, 0);

  return NextResponse.json({
    success: true,
    count: serverDocs.length,
    totalTokens,
    totalChunks,
    documents: serverDocs,
    syncedAt: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.fileName) {
      return NextResponse.json(
        { error: "Title and fileName are required" },
        { status: 400 }
      );
    }

    const content = body.content || body.title;
    const estimatedTokens = Math.max(150, Math.round(content.length / 4));

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: body.title,
      fileName: body.fileName,
      fileSize: body.fileSize || `${(content.length / 1024).toFixed(1)} KB`,
      tokenCount: estimatedTokens,
      uploadedAt: new Date().toISOString().split("T")[0],
      chunks: [
        {
          id: `chunk-${Date.now()}-1`,
          documentId: `doc-${Date.now()}`,
          chunkIndex: 1,
          pageNumber: 1,
          content: content.substring(0, 500),
        },
      ],
    };

    serverDocs = [newDoc, ...serverDocs];

    return NextResponse.json({
      success: true,
      message: "Document ingested and vectorized",
      document: newDoc,
    });
  } catch (error) {
    return NextResponse.json({ error: "Ingestion failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing document id" }, { status: 400 });
  }

  serverDocs = serverDocs.filter((d) => d.id !== id);

  return NextResponse.json({
    success: true,
    message: "Document deleted from vector vault",
    remainingCount: serverDocs.length,
  });
}

