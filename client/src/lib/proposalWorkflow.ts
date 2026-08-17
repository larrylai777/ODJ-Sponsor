export const proposalStatuses = ["draft", "under_review", "revision_requested", "published", "paused", "completed"] as const;

export type ProposalStatus = (typeof proposalStatuses)[number];

export type ProposalFormValues = {
  title: string;
  category: string;
  summary: string;
  description: string;
  creatorName: string;
  coverUrl: string;
  targetAmount: number;
  minimumSupportAmount: number;
  budgetUse: string;
  currentStage: string;
  nextMilestone: string;
  estimatedCompletion: string;
};

export const creatorSteps = [
  { id: 1, label: "作品資料" },
  { id: 2, label: "支持目標" },
  { id: 3, label: "透明度" },
  { id: 4, label: "檢查送審" },
] as const;

export type CreatorStep = (typeof creatorSteps)[number]["id"];

export const milestonePlan = [
  { id: "activation", title: "提案核准與開工確認", percentage: 30 },
  { id: "core-production", title: "初稿或核心製作完成", percentage: 40 },
  { id: "completion", title: "定稿或公開準備完成", percentage: 30 },
] as const;

export const proposalStatusLabel: Record<ProposalStatus, string> = {
  draft: "草稿",
  under_review: "審核中",
  revision_requested: "待補件",
  published: "已公開",
  paused: "暫停支持",
  completed: "已完成",
};

export function canEditProposal(status?: string) {
  return status === "draft" || status === "revision_requested";
}

export function getSubmissionErrors(values: ProposalFormValues) {
  const errors: string[] = [];
  const requiredFields: Array<[keyof ProposalFormValues, string]> = [
    ["title", "作品名稱"],
    ["category", "作品類型"],
    ["summary", "作品簡介"],
    ["description", "完整提案說明"],
    ["creatorName", "創作者顯示名稱"],
    ["coverUrl", "封面圖片網址"],
    ["budgetUse", "款項用途"],
    ["currentStage", "目前製作階段"],
    ["nextMilestone", "下一個里程碑"],
    ["estimatedCompletion", "預計完成時間"],
  ];

  for (const [field, label] of requiredFields) {
    if (!String(values[field] ?? "").trim()) errors.push(`請填寫${label}`);
  }

  if (!Number.isFinite(values.minimumSupportAmount) || values.minimumSupportAmount < 1) errors.push("最低支持金額須至少為 NT$ 1");
  if (!Number.isFinite(values.targetAmount) || values.targetAmount < values.minimumSupportAmount) errors.push("目標支持金額須大於或等於最低支持金額");
  if (values.coverUrl && !isHttpsUrl(values.coverUrl)) errors.push("封面圖片網址須使用 HTTPS");

  return errors;
}

export function getStepErrors(values: ProposalFormValues, step: CreatorStep) {
  const errors: string[] = [];
  const fieldsByStep: Record<CreatorStep, Array<[keyof ProposalFormValues, string]>> = {
    1: [["title", "作品名稱"], ["category", "作品類型"], ["summary", "作品簡介"], ["description", "完整提案說明"], ["creatorName", "創作者顯示名稱"], ["coverUrl", "封面圖片網址"]],
    2: [["budgetUse", "款項用途"]],
    3: [["currentStage", "目前製作階段"], ["nextMilestone", "下一個里程碑"], ["estimatedCompletion", "預計完成時間"]],
    4: [],
  };

  for (const [field, label] of fieldsByStep[step]) {
    if (!String(values[field] ?? "").trim()) errors.push(`請填寫${label}`);
  }

  if (step === 2) {
    if (!Number.isFinite(values.minimumSupportAmount) || values.minimumSupportAmount < 1) errors.push("最低支持金額須至少為 NT$ 1");
    if (!Number.isFinite(values.targetAmount) || values.targetAmount < values.minimumSupportAmount) errors.push("目標支持金額須大於或等於最低支持金額");
  }

  if (step === 1 && values.coverUrl && !isHttpsUrl(values.coverUrl)) errors.push("封面圖片網址須使用 HTTPS");

  return errors;
}

export function isSubmissionReady(values: ProposalFormValues) {
  return getSubmissionErrors(values).length === 0;
}

export function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
