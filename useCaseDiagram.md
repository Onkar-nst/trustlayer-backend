# TrustLayer — Use Case Diagram

## Actors

| Actor | Description |
|---|---|
| **User** | Registers, does transactions, writes reviews |
| **Admin** | Verifies identities, resolves disputes |
| **System** | Auto-calculates trust scores, sends notifications |

## Use Cases

```
         ┌──────────────────────────────────┐
         │        TrustLayer System          │
         │                                   │
   User ─┤  • Register / Login              │
         │  • Submit Identity Documents      │
         │  • Create Transaction             │
         │  • Submit Review                  │
         │  • View Trust Score               │
         │  • File Dispute                   │
         │                                   │
  Admin ─┤  • Verify / Reject Identity      │
         │  • Resolve Disputes               │
         │  • Manage Users                   │
         │                                   │
 System ─┤  • Calculate Trust Score          │
         │  • Send Notifications             │
         │  • Write Audit Log                │
         └──────────────────────────────────┘
```

## Use Case Descriptions

| # | Use Case | Actor | Description |
|---|---|---|---|
| 1 | Register / Login | User | Create account with email & password, get JWT token |
| 2 | Submit Identity | User | Upload ID document for verification |
| 3 | Verify Identity | Admin | Approve or reject user's ID documents |
| 4 | Create Transaction | User | Record a transaction with another verified user |
| 5 | Submit Review | User | Rate (1-5) the other party after transaction completes |
| 6 | View Trust Score | User | See own trust score and tier |
| 7 | File Dispute | User | Challenge an unfair review |
| 8 | Resolve Dispute | Admin | Review evidence, uphold or remove the review |
| 9 | Calculate Score | System | Auto-recalculate score when new review is added |
| 10 | Send Notification | System | Notify user on verification, review, or score change |

## Relationships

- **Submit Review** → triggers → **Calculate Trust Score** (includes)
- **Create Transaction** → can lead to → **Submit Review** (extends)
- **File Dispute** → triggers → **Send Notification** (includes)
- **Resolve Dispute** → triggers → **Calculate Trust Score** (includes)
