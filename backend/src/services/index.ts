import { AuthService } from './AuthService';
import { UserService } from './UserService';
import { IdentityService } from './IdentityService';
import { TransactionService } from './TransactionService';
import { ReviewService } from './ReviewService';
import { DisputeService } from './DisputeService';
import { TrustScoreService } from './TrustScoreService';
import { AuditService } from './AuditService';

export const authService = new AuthService();
export const userService = new UserService();
export const identityService = new IdentityService();
export const transactionService = new TransactionService();
export const reviewService = new ReviewService();
export const disputeService = new DisputeService();
export const trustScoreService = new TrustScoreService();
export const auditService = new AuditService();
