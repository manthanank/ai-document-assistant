import { describe, it, expect } from "vitest";
import { GET as getDocuments } from "../app/api/documents/route";

describe("AI Document Assistant API Routes", () => {
  it("GET /api/documents returns indexed documents", async () => {
    const req = new Request("http://localhost:3000/api/documents");
    const res = await getDocuments(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.documents)).toBe(true);
  });
});
