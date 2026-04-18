export interface CreateAuditDTO {
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogResponse {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  metadata: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}
