# TrustLayer — ER Diagram

## Tables Overview

```
┌──────────┐     ┌────────────┐     ┌──────────────┐
│  users   │◄────│ identities │     │ transactions │
│  (PK: id)│     │ (FK:userId)│     │ (FK:partyA,B)│
└────┬─────┘     └────────────┘     └──────┬───────┘
     │                                      │
┌────▼──────────┐  ┌────────────-┐   ┌──────▼───────┐
│ trust_scores  │  │  disputes   │◄──│   reviews    │
│ (FK: userId)  │  │(FK:reviewId)│   │(FK: txnId)   │
└───────────────┘  └────────────-┘   └──────────────┘
```

## Table Definitions

### users
| Column | Type | Key |
|---|---|---|
| id | UUID | PK |
| name | VARCHAR | |
| email | VARCHAR | UNIQUE |
| password_hash | VARCHAR | |
| role | ENUM (USER, ADMIN) | |
| status | ENUM (ACTIVE, SUSPENDED) | |
| created_at | TIMESTAMP | |

### identities
| Column | Type | Key |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users |
| document_type | VARCHAR | |
| document_path | VARCHAR | |
| status | ENUM (PENDING, VERIFIED, REJECTED) | |
| verified_by | UUID | FK → users |
| created_at | TIMESTAMP | |

### transactions
| Column | Type | Key |
|---|---|---|
| id | UUID | PK |
| party_a_id | UUID | FK → users |
| party_b_id | UUID | FK → users |
| type | ENUM (SERVICE, PURCHASE, RENTAL) | |
| amount | DECIMAL | |
| status | ENUM (PENDING, COMPLETED, CANCELLED) | |
| created_at | TIMESTAMP | |

### reviews
| Column | Type | Key |
|---|---|---|
| id | UUID | PK |
| transaction_id | UUID | FK → transactions |
| reviewer_id | UUID | FK → users |
| reviewee_id | UUID | FK → users |
| rating | INT (1-5) | |
| comment | VARCHAR | |
| created_at | TIMESTAMP | |

### trust_scores
| Column | Type | Key |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users (UNIQUE) |
| score | DECIMAL (0-100) | |
| tier | ENUM (UNRATED, BRONZE, SILVER, GOLD, PLATINUM) | |
| calculated_at | TIMESTAMP | |

### disputes
| Column | Type | Key |
|---|---|---|
| id | UUID | PK |
| review_id | UUID | FK → reviews (UNIQUE) |
| filed_by | UUID | FK → users |
| reason | TEXT | |
| status | ENUM (OPEN, RESOLVED, DISMISSED) | |
| resolved_by | UUID | FK → users |
| created_at | TIMESTAMP | |

## Foreign Key Summary

```
identities.user_id      → users.id
transactions.party_a_id → users.id
transactions.party_b_id → users.id
reviews.transaction_id  → transactions.id
reviews.reviewer_id     → users.id
reviews.reviewee_id     → users.id
trust_scores.user_id    → users.id
disputes.review_id      → reviews.id
disputes.filed_by       → users.id
```
