import { TrustScoreRepository } from '../repositories/TrustScoreRepository';
import { UserRepository } from '../repositories/UserRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { ReviewRepository } from '../repositories/ReviewRepository';
import { ITrustScoreStrategy, DefaultTrustStrategy } from '../strategies/TrustScoreStrategy';
import { DomainEvents, eventBus } from '../observers/EventBus';

export class TrustScoreService {
  private trustScoreRepo = new TrustScoreRepository();
  private userRepo = new UserRepository();
  private transactionRepo = new TransactionRepository();
  private reviewRepo = new ReviewRepository();
  private strategy: ITrustScoreStrategy = new DefaultTrustStrategy();

  async recalculate(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) return;

    // Get completed transactions count
    const transactions = await this.transactionRepo.findByUser(userId, 0, 1000);
    const completedTransactionsCount = transactions.filter(t => t.status === 'COMPLETED').length;

    // Get average rating
    const reviews = await this.reviewRepo.findByUser(userId, 0, 1000);
    const averageRating = reviews.length > 0 
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
      : 0;

    const currentScore = await this.trustScoreRepo.findByUserId(userId);
    const penaltyPoints = currentScore?.penaltyPoints || 0;

    const breakdown = this.strategy.calculate({
      userId,
      isIdentityVerified: !!user.identity && user.identity.status === 'VERIFIED',
      completedTransactionsCount,
      averageRating,
      penaltyPoints,
    });

    await this.trustScoreRepo.update(userId, {
      total: breakdown.total,
      identityBonus: breakdown.identityBonus,
      transactionBonus: breakdown.transactionBonus,
      reviewBonus: breakdown.reviewBonus,
      penaltyPoints: breakdown.penaltyPoints,
    });

    eventBus.emitDomainEvent(DomainEvents.SCORE_RECALCULATED, breakdown);
    return breakdown;
  }

  async getBreakdown(userId: string) {
    return this.trustScoreRepo.findByUserId(userId);
  }
}
