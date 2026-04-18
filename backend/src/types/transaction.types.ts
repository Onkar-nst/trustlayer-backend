export type TransactionType = 'PAYMENT' | 'REFUND' | 'ESCROW' | 'TRANSFER';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'DISPUTED';

export interface CreateTransactionDTO {
  senderId: string;
  receiverId: string;
  amount: number;
  currency?: string;
  type: TransactionType;
  description?: string;
}

export interface TransactionResponse {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  description?: string | null;
  createdAt: Date;
  completedAt?: Date | null;
}
