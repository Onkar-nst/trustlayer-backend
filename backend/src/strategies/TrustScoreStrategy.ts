export interface TrustScoreBreakdown {
  userId: string;
  total: number;
  baseScore: number;
  identityBonus: number;
  transactionBonus: number;
  reviewBonus: number;
  penaltyPoints: number;
}

export interface TrustScoreInput {
  userId: string;
  isIdentityVerified: boolean;
  completedTransactionsCount: number;
  averageRating: number;
  penaltyPoints: number;
}

export interface ITrustScoreStrategy {
  calculate(input: TrustScoreInput): TrustScoreBreakdown;
}

export class DefaultTrustStrategy implements ITrustScoreStrategy {
  calculate(input: TrustScoreInput): TrustScoreBreakdown {
    const baseScore = 50;
    const identityBonus = input.isIdentityVerified ? 20 : 0;
    
    // min(completedTransactions * 2, 30)
    const transactionBonus = Math.min(input.completedTransactionsCount * 2, 30);
    
    // min(averageRating * 4, 20)
    const reviewBonus = Math.round(Math.min(input.averageRating * 4, 20));
    
    const penaltyPoints = input.penaltyPoints;
    
    const total = baseScore + identityBonus + transactionBonus + reviewBonus - penaltyPoints;
    
    return {
      userId: input.userId,
      total: Math.max(0, total), // Score shouldn't be negative
      baseScore,
      identityBonus,
      transactionBonus,
      reviewBonus,
      penaltyPoints,
    };
  }
}
