import { DisputeRepository } from '../repositories/DisputeRepository';
import { ReviewRepository } from '../repositories/ReviewRepository';
import { TrustScoreRepository } from '../repositories/TrustScoreRepository';
import { DomainEvents, eventBus } from '../observers/EventBus';

export class DisputeService {
  private disputeRepo = new DisputeRepository();
  private reviewRepo = new ReviewRepository();
  private trustScoreRepo = new TrustScoreRepository();

  async create(data: any) {
    return this.disputeRepo.create(data);
  }

  async getByUser(userId: string) {
    return this.disputeRepo.findByUser(userId);
  }

  async getAll() {
    return this.disputeRepo.findAll();
  }

  async resolve(id: string, adminId: string, data: any) {
    const dispute = await this.disputeRepo.findById(id);
    if (!dispute) throw { status: 404, message: 'Dispute not found' };

    const resolvedDispute = await this.disputeRepo.update(id, {
      status: data.verdict === 'accept' ? 'RESOLVED' : 'REJECTED',
      resolution: data.resolution,
      resolvedAt: new Date(),
      resolvedBy: adminId,
    });

    if (data.verdict === 'accept' && dispute.targetReviewId) {
      await this.reviewRepo.delete(dispute.targetReviewId);
      
      const review = await this.reviewRepo.findById(dispute.targetReviewId);
      if (review) {
        // Apply penalty to subject
        const currentScore = await this.trustScoreRepo.findByUserId(review.subjectId);
        await this.trustScoreRepo.update(review.subjectId, {
          penaltyPoints: (currentScore?.penaltyPoints || 0) + 2
        });
        eventBus.emitDomainEvent(DomainEvents.DISPUTE_RESOLVED, { userId: review.subjectId });
      }
    }

    return resolvedDispute;
  }
}
