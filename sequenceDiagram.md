# TrustLayer — Sequence Diagram

## Main Flow: Registration → Verification → Transaction → Review → Trust Score

### Sequence 1: User Registration

```
User → Controller: POST /register {name, email, password}
Controller → AuthService: validate & hash password
AuthService → Database: save user (status: UNVERIFIED)
Database → AuthService: user created
AuthService → Controller: generate JWT token
Controller → User: 201 {token, user}
```

### Sequence 2: Identity Verification

```
User → Controller: POST /identity {documentFile}
Controller → IdentityService: store document
IdentityService → Database: save identity (status: PENDING)
Controller → User: 200 {status: PENDING}

--- Later ---

Admin → Controller: PUT /identity/:id/verify
Controller → IdentityService: update status to VERIFIED
IdentityService → Database: update identity + user
IdentityService → NotificationService: notify user "Identity Verified"
Controller → Admin: 200 {status: VERIFIED}
```

### Sequence 3: Transaction Creation

```
User → Controller: POST /transactions {counterPartyId, amount, type}
Controller → TransactionService: check both users are VERIFIED
TransactionService → Database: save transaction (status: PENDING)
Controller → User: 201 {transactionId}

--- Counter-party confirms ---

PartyB → Controller: PUT /transactions/:id/confirm
TransactionService → Database: update status to COMPLETED
Controller → PartyB: 200 {status: COMPLETED}
```

### Sequence 4: Review & Trust Score

```
User → Controller: POST /reviews {transactionId, rating, comment}
Controller → ReviewService: check transaction is COMPLETED
ReviewService → Database: save review
ReviewService → TrustScoreService: recalculate score for reviewee
TrustScoreService → Database: fetch reviews + transactions
TrustScoreService → TrustScoreService: calculate weighted score
TrustScoreService → Database: update trust score & tier
TrustScoreService → NotificationService: notify "Score changed"
Controller → User: 201 {reviewId}
```

## Score Calculation Logic

```
Score = (avg_rating × 0.4) + (txn_count_factor × 0.3) + (recency × 0.2) + (dispute_factor × 0.1)

Tier: 0-20 = Unrated | 21-40 = Bronze | 41-60 = Silver | 61-80 = Gold | 81-100 = Platinum
```
