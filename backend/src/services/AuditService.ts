import { AuditRepository } from '../repositories/AuditRepository';
import { CreateAuditDTO } from '../types/audit.types';

export class AuditService {
  private auditRepo = new AuditRepository();

  async log(data: CreateAuditDTO) {
    return this.auditRepo.create({
      userId: data.userId,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });
  }

  async getByUser(userId: string) {
    return this.auditRepo.findByUser(userId);
  }

  async getAll() {
    return this.auditRepo.findAll();
  }
}
