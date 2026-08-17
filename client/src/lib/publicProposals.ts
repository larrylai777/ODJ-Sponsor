import type { ProposalFormValues } from "@/lib/proposalWorkflow";

type TimestampLike = { toDate?: () => Date };

export type PublicProposal = Partial<ProposalFormValues> & {
  id: string;
  status?: string;
  totalRaised?: number;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
};

export type FundingProgress = {
  raised: number;
  target: number;
  percentage: number;
  barPercentage: number;
};

const timestampValue = (value?: TimestampLike) => value?.toDate?.().getTime() ?? 0;

export function selectPublishedProposals(proposals: PublicProposal[]) {
  return proposals
    .filter((proposal) => proposal.status === "published")
    .sort((a, b) => timestampValue(b.updatedAt ?? b.createdAt) - timestampValue(a.updatedAt ?? a.createdAt));
}

export function getFundingProgress(proposal: Pick<PublicProposal, "totalRaised" | "targetAmount">): FundingProgress {
  const raised = Math.max(0, Number(proposal.totalRaised) || 0);
  const target = Math.max(0, Number(proposal.targetAmount) || 0);
  const percentage = target > 0 ? Math.round((raised / target) * 100) : 0;

  return { raised, target, percentage, barPercentage: Math.min(100, percentage) };
}
