import { TransactionRepository } from '../repositories/TransactionRepository';
import { DomainEvents, eventBus } from '../observers/EventBus';

export class TransactionService {
  private transactionRepo = new TransactionRepository();

  async create(data: any) {
    const transaction = await this.transactionRepo.create(data);
    return transaction;
  }

  async getByUser(userId: string, skip?: number, take?: number) {
    return this.transactionRepo.findByUser(userId, skip, take);
  }

  async getById(id: string) {
    return this.transactionRepo.findById(id);
  }

  async complete(id: string) {
    const transaction = await this.transactionRepo.updateStatus(id, 'COMPLETED', new Date());
    eventBus.emitDomainEvent(DomainEvents.TRANSACTION_COMPLETED, { 
      userId: transaction.senderId, 
      receiverId: transaction.receiverId 
    });
    return transaction;
  }

  async fail(id: string) {
    return this.transactionRepo.updateStatus(id, 'FAILED');
  }
}
