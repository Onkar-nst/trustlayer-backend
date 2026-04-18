import { ReviewRepository } from '../repositories/ReviewRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { DomainEvents, eventBus } from '../observers/EventBus';
import { CreateReviewDTO } from '../types/review.types';

export class ReviewService {
  private reviewRepo = new ReviewRepository();
  private transactionRepo = new TransactionRepository();

  async create(data: CreateReviewDTO) {
    // Verify completed transaction exists
    const transaction = await this.transactionRepo.findById(data.transactionId);
    if (!transaction || transaction.status !== 'COMPLETED') {
      throw { status: 400, message: 'Review requires a completed transaction' };
    }

    const review = await this.reviewRepo.create(data);
    eventBus.emitDomainEvent(DomainEvents.REVIEW_POSTED, { userId: data.authorId, subjectId: data.subjectId });
    return review;
  }

  async getByUser(userId: string) {
    return this.reviewRepo.findByUser(userId);
  }

  async getGiven(userId: string) {
    return this.reviewRepo.findByAuthor(userId);
  }

  async update(id: string, userId: string, data: any) {
    const review = await this.reviewRepo.findById(id);
    if (!review || review.authorId !== userId) {
      throw { status: 403, message: 'Unauthorized' };
    }

    // 24h limit
    const diff = Date.now() - new Date(review.createdAt).getTime();
    if (diff > 24 * 60 * 60 * 1000) {
      throw { status: 400, message: 'Review cannot be edited after 24 hours' };
    }

    return this.reviewRepo.update(id, data);
  }

  async delete(id: string, userId: string) {
    const review = await this.reviewRepo.findById(id);
    if (!review || review.authorId !== userId) {
      throw { status: 403, message: 'Unauthorized' };
    }
    return this.reviewRepo.delete(id);
  }
}
