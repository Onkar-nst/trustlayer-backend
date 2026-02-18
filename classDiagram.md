# TrustLayer — Class Diagram

## Entity Classes (Models)

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│    User      │   │  Identity    │   │ Transaction  │
├──────────────┤   ├──────────────┤   ├──────────────┤
│ -id          │   │ -id          │   │ -id          │
│ -name        │◄──│ -userId      │   │ -partyAId    │
│ -email       │   │ -docType     │   │ -partyBId    │
│ -passwordHash│   │ -docPath     │   │ -amount      │
│ -role        │   │ -status      │   │ -type        │
│ -status      │   │ -verifiedBy  │   │ -status      │
├──────────────┤   ├──────────────┤   ├──────────────┤
│ +toJSON()    │   │ +isVerified()│   │ +isCompleted │
└──────────────┘   └──────────────┘   └──────┬───────┘
       │                                      │
┌──────▼───────┐   ┌──────────────┐   ┌──────▼───────┐
│  TrustScore  │   │   Dispute    │   │   Review     │
├──────────────┤   ├──────────────┤   ├──────────────┤
│ -id          │   │ -id          │   │ -id          │
│ -userId      │   │ -reviewId    │◄──│ -txnId       │
│ -score       │   │ -filedBy     │   │ -reviewerId  │
│ -tier        │   │ -reason      │   │ -revieweeId  │
│ -breakdown   │   │ -status      │   │ -rating      │
├──────────────┤   │ -resolvedBy  │   │ -comment     │
│ +getTier()   │   ├──────────────┤   ├──────────────┤
└──────────────┘   │ +isOpen()    │   │ +isPositive()│
                   └──────────────┘   └──────────────┘
```

## Service Classes (Business Logic)

| Class | Key Methods |
|---|---|
| AuthService | register(), login(), verifyToken() |
| IdentityService | submitDoc(), verify(), reject() |
| TransactionService | create(), confirm(), getByUser() |
| ReviewService | submit(), getByUser() |
| TrustScoreService | calculate(), recalculate() — uses **Strategy Pattern** |
| DisputeService | file(), resolve(), dismiss() |
| NotificationService | send(), getByUser() — uses **Observer Pattern** |

## Design Patterns Used

**Strategy Pattern** — TrustScoreService uses a `ScoreCalculator` interface.
Different algorithms (WeightedAverage, SimpleAverage) can be swapped without changing code.

**Observer Pattern** — When a review is submitted, the system automatically:
1. Recalculates trust score
2. Sends notification to the reviewed user

## Relationships

| From | To | Type | Cardinality |
|---|---|---|---|
| User | TrustScore | has | 1 : 1 |
| User | Identity | has | 1 : 1 |
| User | Transaction | participates | 1 : many |
| Transaction | Review | has | 1 : max 2 |
| Review | Dispute | has | 1 : 0 or 1 |
