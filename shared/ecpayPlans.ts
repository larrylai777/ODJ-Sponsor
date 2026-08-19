export type EcpayPlanId = "support" | "book" | "collector";

/** 純支持方案：品名與金額須與 client/src/pages/Project.tsx 的 supportOptions 對齊。 */
export const ecpayPlans: Record<
  EcpayPlanId,
  { itemName: string; amount: number }
> = {
  support: { itemName: "老東家｜晨光支持者（純支持）", amount: 390 },
  book: { itemName: "老東家｜故事守護者（純支持）", amount: 890 },
  collector: { itemName: "老東家｜長篇同行人（純支持）", amount: 1690 },
};

export function isEcpayPlanId(value: string): value is EcpayPlanId {
  return value === "support" || value === "book" || value === "collector";
}
