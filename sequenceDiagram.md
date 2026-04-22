# TrustLayer — Sequence Diagrams

## 1. User Registration & Login

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant AuthService
    participant Prisma
    participant JWT

    Client->>AuthController: POST /api/auth/register {email, password, displayName}
    AuthController->>AuthService: register(data)
    AuthService->>Prisma: user.create() + profile.create() + trustScore.create()
    Prisma-->>AuthService: User record
    AuthService->>JWT: sign(accessToken, 15m)
    AuthService->>JWT: sign(refreshToken, 7d)
    AuthService-->>AuthController: {user, accessToken}
    AuthController-->>Client: 201 {user, accessToken} + refreshToken (httpOnly cookie)
```

---

## 2. JWT Token Refresh

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant AuthService
    participant JWT

    Client->>AuthController: POST /api/auth/refresh (sends refreshToken cookie)
    AuthController->>JWT: verify(refreshToken)
    JWT-->>AuthController: decoded payload
    AuthController->>AuthService: generate new accessToken
    AuthService-->>Client: 200 {accessToken}

    Note over Client: Frontend axios interceptor retries<br/>failed 401 requests automatically
```

---

## 3. Identity Verification Flow

```mermaid
sequenceDiagram
    participant User
    participant IdentityController
    participant IdentityService
    participant Prisma
    participant Admin
    participant EventBus

    User->>IdentityController: POST /api/identity {documentType, documentUrl}
    IdentityController->>IdentityService: submit(userId, data)
    IdentityService->>Prisma: identityVerification.upsert(status: PENDING)
    Prisma-->>User: 200 {status: PENDING}

    Admin->>IdentityController: POST /api/admin/identity/:userId/approve
    IdentityController->>IdentityService: approve(userId, adminId)
    IdentityService->>Prisma: update(status: VERIFIED)
    IdentityService->>EventBus: emit(IDENTITY_VERIFIED, {userId})
    EventBus->>Prisma: auditLog.create(action: identity.verified)
    IdentityController-->>Admin: 200 {status: VERIFIED}
```

---

## 4. Transaction Creation & Completion

```mermaid
sequenceDiagram
    participant Sender
    participant TxController
    participant TxService
    participant UserRepo
    participant Prisma
    participant Receiver

    Sender->>TxController: POST /api/transactions {receiverId, amount, type}
    TxController->>TxService: create({senderId, receiverId, amount, type})
    TxService->>UserRepo: findById(receiverId)
    UserRepo-->>TxService: receiver (or null)
    alt Receiver not found
        TxService-->>Sender: 400 {error: "Receiver not found"}
    else Valid receiver
        TxService->>Prisma: transaction.create(status: PENDING)
        Prisma-->>Sender: 200 {transactionId, status: PENDING}
    end

    Receiver->>TxController: PATCH /api/transactions/:id/complete
    TxController->>TxService: complete(transactionId)
    TxService->>Prisma: update(status: COMPLETED, completedAt: now())
    TxService->>EventBus: emit(TRANSACTION_COMPLETED, {senderId, receiverId})
    EventBus->>TrustScoreService: recalculate(userId)
    Prisma-->>Receiver: 200 {status: COMPLETED}
```

---

## 5. Review Submission & Trust Score Recalculation

```mermaid
sequenceDiagram
    participant Reviewer
    participant ReviewController
    participant ReviewService
    participant TrustScoreService
    participant Prisma
    participant EventBus

    Reviewer->>ReviewController: POST /api/reviews {subjectId, transactionId, rating, body}
    ReviewController->>ReviewService: create(data)
    ReviewService->>Prisma: review.create()
    ReviewService->>EventBus: emit(REVIEW_SUBMITTED, {subjectId})
    EventBus->>TrustScoreService: recalculate(subjectId)
    TrustScoreService->>Prisma: fetch all reviews for subject
    TrustScoreService->>Prisma: fetch completed transactions
    TrustScoreService->>TrustScoreService: calculate(50 + identityBonus + txnBonus + reviewBonus - penalties)
    TrustScoreService->>Prisma: trustScore.update(total, breakdown)
    Prisma-->>Reviewer: 201 {reviewId}
```

---

## 6. Dispute Filing & Resolution

```mermaid
sequenceDiagram
    participant User
    participant DisputeController
    participant DisputeService
    participant Prisma
    participant Admin

    User->>DisputeController: POST /api/disputes {reason, targetReviewId}
    DisputeController->>DisputeService: create(raisedById, data)
    DisputeService->>Prisma: dispute.create(status: OPEN)
    Prisma-->>User: 201 {disputeId}

    Admin->>DisputeController: PATCH /api/admin/disputes/:id/resolve {verdict, resolution}
    DisputeController->>DisputeService: resolve(id, verdict, resolution)
    DisputeService->>Prisma: dispute.update(status: RESOLVED or REJECTED)
    Prisma-->>Admin: 200 {status: RESOLVED}
```

---

## Trust Score Formula

```
TrustScore = baseScore (50)
           + identityBonus   → up to +20  (verified identity)
           + transactionBonus → up to +30 (completed transactions × 2)
           + reviewBonus     → up to +20  (avg rating × 4)
           - penaltyPoints   → -5 per upheld dispute
```

| Score Range | Tier     |
|-------------|----------|
| 0 – 40      | Unrated  |
| 41 – 60     | Bronze   |
| 61 – 75     | Silver   |
| 76 – 90     | Gold     |
| 91 – 120    | Platinum |
