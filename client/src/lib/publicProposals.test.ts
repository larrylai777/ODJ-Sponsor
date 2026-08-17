import { describe, expect, it } from "vitest";
import { selectPublishedProposals } from "./publicProposals";

const timestamp = (value: string) => ({ toDate: () => new Date(value) });

describe("selectPublishedProposals", () => {
  it("只回傳已公開作品，避免草稿或審核中提案出現在首頁", () => {
    const proposals = selectPublishedProposals([
      { id: "published", status: "published", title: "已公開作品" },
      { id: "review", status: "under_review", title: "待審作品" },
      { id: "draft", status: "draft", title: "草稿作品" },
    ]);

    expect(proposals.map((proposal) => proposal.id)).toEqual(["published"]);
  });

  it("將最新更新的公開作品排在首頁前方", () => {
    const proposals = selectPublishedProposals([
      { id: "older", status: "published", updatedAt: timestamp("2026-08-17T00:00:00.000Z") },
      { id: "newer", status: "published", updatedAt: timestamp("2026-08-18T00:00:00.000Z") },
    ]);

    expect(proposals.map((proposal) => proposal.id)).toEqual(["newer", "older"]);
  });
});
