import { describe, expect, it } from "vitest";
import { canEditProposal, getSubmissionErrors, isSubmissionReady, milestonePlan } from "./proposalWorkflow";

const completeProposal = {
  title: "月海檔案",
  category: "奇幻小說",
  summary: "一部關於潮汐與失物的小說。",
  description: "完整的作品提案與創作計畫。",
  creatorName: "邊城製本所",
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
    expect(getSubmissionErrors({ ...completeProposal, budgetUse: "", targetAmount: 50 })).toEqual(expect.arrayContaining(["請填寫款項用途", "目標支持金額須大於或等於最低支持金額"]));
  });

  it("固定三期撥付總額為百分之百", () => {
    expect(milestonePlan.reduce((total, milestone) => total + milestone.percentage, 0)).toBe(100);
  });
});
