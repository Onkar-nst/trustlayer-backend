import { EventEmitter } from 'events';

export enum DomainEvents {
  USER_REGISTERED = 'user.registered',
  IDENTITY_VERIFIED = 'identity.verified',
  IDENTITY_REJECTED = 'identity.rejected',
  TRANSACTION_COMPLETED = 'transaction.completed',
  REVIEW_POSTED = 'review.posted',
  DISPUTE_RESOLVED = 'dispute.resolved',
  SCORE_RECALCULATED = 'score.recalculated',
}

class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
  }

  private anyListeners: ((event: string, payload: any) => void)[] = [];

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public onAny(listener: (event: string, payload: any) => void) {
    this.anyListeners.push(listener);
  }

  public emitDomainEvent(event: DomainEvents, payload: any) {
    console.log(`[EventBus] Emitting event: ${event}`, payload);
    this.emit(event, payload);
    this.anyListeners.forEach(listener => listener(event, payload));
  }
}

export const eventBus = EventBus.getInstance();
