import type { ProposalFormValues } from "@/lib/proposalWorkflow";

type TimestampLike = { toDate?: () => Date };

export type PublicProposal = Partial<ProposalFormValues> & {
  id: string;
  status?: string;
  totalRaised?: number;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
};

const timestampValue = (value?: TimestampLike) => value?.toDate?.().getTime() ?? 0;

export function selectPublishedProposals(proposals: PublicProposal[]) {
  return proposals
    .filter((proposal) => proposal.status === "published")
    .sort((a, b) => timestampValue(b.updatedAt ?? b.createdAt) - timestampValue(a.updatedAt ?? a.createdAt));
}
