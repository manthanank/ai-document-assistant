import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DocuMind AI — Document Assistant & RAG Semantic Search",
    short_name: "DocuMind",
    description: "AI-powered document intelligence engine with PDF chunking, pgvector HNSW indexing, and conversational streaming chat.",
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#8b5cf6",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
