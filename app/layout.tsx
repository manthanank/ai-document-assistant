import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/context/AuthContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ai-document-assistant-lyart.vercel.app"),
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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-document-assistant-lyart.vercel.app",
    siteName: "DocuMind AI",
    title: "DocuMind AI — Document Assistant & RAG Semantic Search",
    description: "Upload PDFs, vector embeddings, semantic search, streaming chat & source citations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocuMind AI — Document Assistant & RAG Semantic Search",
    description: "Upload PDFs, vector embeddings, semantic search, streaming chat & source citations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "DocuMind AI Document Assistant",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Manthan Ank",
      url: "https://github.com/manthanank",
    },
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
