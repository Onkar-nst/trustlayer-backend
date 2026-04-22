# TrustLayer — Entity Relationship Diagram

> Reflects the actual Prisma schema (`backend/prisma/schema.prisma`).

---

## ER Diagram

```mermaid
erDiagram
    User {
        String id PK
        String email UK
        String passwordHash
        String role
        DateTime createdAt
        DateTime updatedAt
    }

    UserProfile {
        String userId PK_FK
        String displayName
        String avatarUrl
        String bio
        Boolean isPublic
    }

    IdentityVerification {
        String userId PK_FK
        String documentType
        String documentUrl
        String status
        DateTime reviewedAt
        String reviewedBy
        String rejectionReason
        DateTime createdAt
    }

    TrustScore {
        String userId PK_FK
        Int total
        Int baseScore
        Int identityBonus
        Int transactionBonus
        Int reviewBonus
        Int penaltyPoints
        DateTime lastRecalculatedAt
    }

    Transaction {
        String id PK
        String senderId FK
        String receiverId FK
        Float amount
        String currency
        String type
        String status
        String description
        DateTime createdAt
        DateTime completedAt
    }

    Review {
        String id PK
        String authorId FK
        String subjectId FK
        String transactionId FK
        Int rating
        String body
        Boolean isAnonymous
        String status
        DateTime createdAt
    }

    Dispute {
        String id PK
        String raisedById FK
        String targetReviewId FK
        String targetTransactionId FK
        String reason
        String evidenceText
        String status
        String resolution
        DateTime resolvedAt
        String resolvedBy FK
        DateTime createdAt
    }

    AuditLog {
        String id PK
        String userId FK
        String action
        String entity
        String entityId
        String metadata
        String ipAddress
        String userAgent
        DateTime createdAt
    }

    User ||--o| UserProfile : "has"
    User ||--o| IdentityVerification : "has"
    User ||--o| TrustScore : "has"
    User ||--o{ Transaction : "sends"
    User ||--o{ Transaction : "receives"
    User ||--o{ Review : "authors"
    User ||--o{ Review : "receives"
    User ||--o{ Dispute : "raises"
    User ||--o{ AuditLog : "generates"
    Transaction ||--o{ Review : "has"
    Transaction ||--o{ Dispute : "targeted by"
    Review ||--o{ Dispute : "targeted by"
```

---

## Table Summary

| Table                 | PK Type     | Relations                                          |
|-----------------------|-------------|----------------------------------------------------|
| User                  | UUID        | 1:1 Profile, 1:1 Identity, 1:1 TrustScore         |
| UserProfile           | FK(userId)  | Belongs to User                                    |
| IdentityVerification  | FK(userId)  | Belongs to User                                    |
| TrustScore            | FK(userId)  | Belongs to User                                    |
| Transaction           | UUID        | sender→User, receiver→User, has many Reviews       |
| Review                | UUID        | author→User, subject→User, transaction→Transaction |
| Dispute               | UUID        | raisedBy→User, targets Review OR Transaction       |
| AuditLog              | UUID        | Belongs to User                                    |

---

## Status Enumerations

| Model                | Field    | Values                                      |
|----------------------|----------|---------------------------------------------|
| IdentityVerification | status   | `PENDING`, `VERIFIED`, `REJECTED`           |
| Transaction          | status   | `PENDING`, `COMPLETED`, `FAILED`, `DISPUTED`|
| Transaction          | type     | `PAYMENT`, `REFUND`, `ESCROW`, `TRANSFER`   |
| Review               | status   | `ACTIVE`, `HIDDEN`, `DISPUTED`              |
| Dispute              | status   | `OPEN`, `UNDER_REVIEW`, `RESOLVED`, `REJECTED` |
| User                 | role     | `user`, `admin`                             |
