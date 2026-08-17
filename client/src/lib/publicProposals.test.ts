import { describe, expect, it } from "vitest";
import { getFundingProgress, selectPublishedProposals } from "./publicProposals";

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

  it("以已募得與目標金額計算公開募資百分比", () => {
    expect(getFundingProgress({ totalRaised: 182_940, targetAmount: 250_000 })).toEqual({ raised: 182_940, target: 250_000, percentage: 73, barPercentage: 73 });
  });

  it("超額支持仍顯示真實百分比，但進度條不超出卡片", () => {
    expect(getFundingProgress({ totalRaised: 611_200, targetAmount: 500_000 })).toEqual({ raised: 611_200, target: 500_000, percentage: 122, barPercentage: 100 });
  });

  it("未設定有效目標時不產生無效百分比", () => {
    expect(getFundingProgress({ totalRaised: 800, targetAmount: 0 })).toEqual({ raised: 800, target: 0, percentage: 0, barPercentage: 0 });
  });
});
