import { IdentityRepository } from '../repositories/IdentityRepository';
import { DomainEvents, eventBus } from '../observers/EventBus';
import { SubmitIdentityDTO } from '../types/identity.types';

export class IdentityService {
  private identityRepo = new IdentityRepository();

  async upload(userId: string, data: SubmitIdentityDTO) {
    return this.identityRepo.upsert(userId, {
      documentType: data.documentType,
      documentUrl: data.documentUrl,
      status: 'PENDING',
    });
  }

  async getStatus(userId: string) {
    return this.identityRepo.findByUserId(userId);
  }

  async getAllPending() {
    return this.identityRepo.findAllPending();
  }

  async approve(userId: string, adminId: string) {
    const identity = await this.identityRepo.updateStatus(userId, {
      status: 'VERIFIED',
      reviewedAt: new Date(),
      reviewedBy: adminId,
    });
    eventBus.emitDomainEvent(DomainEvents.IDENTITY_VERIFIED, { userId });
    return identity;
  }

  async reject(userId: string, adminId: string, reason: string) {
    const identity = await this.identityRepo.updateStatus(userId, {
      status: 'REJECTED',
      reviewedAt: new Date(),
      reviewedBy: adminId,
      rejectionReason: reason,
    });
    eventBus.emitDomainEvent(DomainEvents.IDENTITY_REJECTED, { userId, reason });
    return identity;
  }
}
