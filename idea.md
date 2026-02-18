# TrustLayer — Idea Document

## Problem Statement

When we use platforms like Upwork, OLX, or rent a flat — we don't know if the other person is trustworthy.
Reviews can be fake. There is no verified trust system that works across platforms.

## Proposed Solution

TrustLayer is a backend system that creates **trust scores** for users based on:
- Verified identity (upload ID proof)
- Real completed transactions
- Reviews from other verified users

## Scope

- Backend-only project (REST APIs)
- Uses layered architecture: Controller → Service → Repository
- Stores data in a relational database

## Key Features

1. **User Registration & Login** — JWT-based authentication
2. **Identity Verification** — Users upload ID, admin verifies
3. **Transactions** — Record real transactions between two users
4. **Reviews** — Users review each other after a transaction
5. **Trust Score** — Auto-calculated from transactions + reviews
6. **Dispute** — Users can challenge unfair reviews

## Non-Goals (Out of Scope)

- No frontend / UI (API only)
- No payment processing
- No AI/ML
- No mobile app
- No blockchain

## Future Scope

- Public API for third-party platforms
- Email/SMS notifications
- Admin dashboard UI

## Software Engineering Practices

| Practice | How We Use It |
|---|---|
| Layered Architecture | Controller → Service → Repository |
| Strategy Pattern | Trust score calculation (pluggable algorithm) |
| Observer Pattern | Notifications on review/score events |
| SOLID Principles | Single responsibility per service class |
| JWT Auth | Stateless, secure authentication |
| Input Validation | At controller level |
| Audit Logging | Every important action is logged |
