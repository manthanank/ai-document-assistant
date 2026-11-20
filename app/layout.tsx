import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "DocuMind AI — Document Assistant & RAG Semantic Search",
  description:
    "AI-powered document intelligence engine with PDF chunking, pgvector HNSW indexing, conversational chat, streamed responses, and token budget limits.",
  keywords: [
    "AI Document Assistant",
    "RAG",
    "pgvector",
    "OpenAI Embeddings",
    "Next.js 15",
    "Semantic Search",
    "Vector Database",
  ],
  authors: [{ name: "Manthan Ank", url: "https://github.com/manthanank" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/manthanank/ai-document-assistant",
    siteName: "DocuMind AI",
    title: "DocuMind AI — Document Assistant & RAG Semantic Search",
    description: "Upload PDFs, vector embeddings, semantic search, streaming chat & source citations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

