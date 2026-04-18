import { DomainEvents, eventBus } from './EventBus';
import { trustScoreService, auditService } from '../services';

export const setupDomainListeners = () => {
  // Audit Listener
  eventBus.onAny(async (event: string, payload: any) => {
    if (Object.values(DomainEvents).includes(event as DomainEvents)) {
      console.log(`[AuditLog] Domain event captured: ${event}`);
      try {
        await auditService.log({
          userId: payload.userId || payload.authorId || payload.senderId || 'SYSTEM',
          action: event as string,
          entity: (event as string).split('.')[0],
          entityId: payload.id || payload.userId || 'N/A',
          metadata: payload
        });
      } catch (err) {
        console.error('Failed to log audit event:', err);
      }
    }
  });

  // Score Recalculation Listener
  const scoreRelevantEvents = [
    DomainEvents.IDENTITY_VERIFIED,
    DomainEvents.TRANSACTION_COMPLETED,
    DomainEvents.REVIEW_POSTED,
    DomainEvents.DISPUTE_RESOLVED
  ];

  scoreRelevantEvents.forEach(event => {
    eventBus.on(event, async (payload: any) => {
       const userId = payload.userId || payload.subjectId || payload.receiverId;
       console.log(`[ScoreListener] Triggering recalculation for user: ${userId}`);
       if (userId && userId !== 'SYSTEM') {
         try {
           await trustScoreService.recalculate(userId);
           // If transaction, also recalculate for sender
           if (event === DomainEvents.TRANSACTION_COMPLETED && payload.userId) {
             await trustScoreService.recalculate(payload.userId);
           }
         } catch (err) {
           console.error('Failed to recalculate trust score:', err);
         }
       }
    });
  });
};
