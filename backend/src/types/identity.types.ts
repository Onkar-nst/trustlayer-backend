export type IdentityStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type DocumentType = 'GOVT_ID' | 'PASSPORT' | 'DRIVING_LICENSE';

export interface SubmitIdentityDTO {
  documentType: DocumentType;
  documentUrl: string;
}

export interface IdentityResponse {
  userId: string;
  documentType: DocumentType;
  documentUrl: string;
  status: IdentityStatus;
  reviewedAt?: Date | null;
  reviewedBy?: string | null;
  rejectionReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
