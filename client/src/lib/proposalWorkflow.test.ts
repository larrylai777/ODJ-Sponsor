import { describe, expect, it } from "vitest";
import { canEditProposal, getStepErrors, getSubmissionErrors, isSubmissionReady, milestonePlan } from "./proposalWorkflow";

const completeProposal = {
  title: "月海檔案",
  category: "奇幻小說",
  summary: "一部關於潮汐與失物的小說。",
  description: "完整的作品提案與創作計畫。",
  creatorName: "邊城製本所",
  coverUrl: "https://images.example.com/moon-archive.jpg",
  targetAmount: 300000,
  minimumSupportAmount: 100,
  budgetUse: "編輯、插畫、校對與公開製作紀錄。",
  currentStage: "大綱與試讀完成",
  nextMilestone: "完成第一章初稿",
  estimatedCompletion: "2027 年 3 月",
};

describe("proposal workflow", () => {
  it("只讓草稿與待補件作品繼續編輯", () => {
    expect(canEditProposal("draft")).toBe(true);
    expect(canEditProposal("revision_requested")).toBe(true);
    expect(canEditProposal("under_review")).toBe(false);
    expect(canEditProposal("published")).toBe(false);
  });

  it("完整的五項透明度與支持金額資料才能送審", () => {
    expect(isSubmissionReady(completeProposal)).toBe(true);
    expect(getSubmissionErrors({ ...completeProposal, budgetUse: "", targetAmount: 50, coverUrl: "http://images.example.com/cover.jpg" })).toEqual(expect.arrayContaining(["請填寫款項用途", "目標支持金額須大於或等於最低支持金額", "封面圖片網址須使用 HTTPS"]));
  });

  it("固定三期撥付總額為百分之百", () => {
    expect(milestonePlan.reduce((total, milestone) => total + milestone.percentage, 0)).toBe(100);
  });

  it("四步驟建立器會在當前步驟阻止未完成的欄位", () => {
    expect(getStepErrors({ ...completeProposal, title: "" }, 1)).toContain("請填寫作品名稱");
    expect(getStepErrors({ ...completeProposal, coverUrl: "http://images.example.com/cover.jpg" }, 1)).toContain("封面圖片網址須使用 HTTPS");
    expect(getStepErrors({ ...completeProposal, targetAmount: 99 }, 2)).toContain("目標支持金額須大於或等於最低支持金額");
    expect(getStepErrors({ ...completeProposal, nextMilestone: "" }, 3)).toContain("請填寫下一個里程碑");
    expect(getStepErrors(completeProposal, 4)).toEqual([]);
  });
});
