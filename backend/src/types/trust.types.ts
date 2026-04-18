export interface TrustScoreBreakdown {
  userId: string;
  total: number;
  baseScore: number;
  identityBonus: number;
  transactionBonus: number;
  reviewBonus: number;
  penaltyPoints: number;
}
