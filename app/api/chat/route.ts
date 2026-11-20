import { NextResponse } from "next/server";
import { generateRagResponse } from "@/lib/rag-engine";

export async function POST(request: Request) {
  try {
    const { query, documents } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const { answer, citations, tokensUsed } = generateRagResponse(
      query,
      documents || []
    );

    return NextResponse.json({
      answer,
      citations,
      tokensUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate document response" },
      { status: 500 }
    );
  }
}

