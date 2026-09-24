# 🗄️ Database Architecture & Schemas

The VELoop Rewards system uses **MongoDB** managed via **Mongoose**. All critical business logic, balances, streak states, and idempotency guarantees reside in the database layer.

---

## 1. Schema Entity Relationship Diagram

```
      ┌──────────────┐
      │     User     │
      └──────┬───────┘
             │ 1
             │
      ┌──────┴───────────────────────────────────────┐
      │ 1                          │ 1               │ 1..N
┌─────▼──────┐              ┌──────▼──────┐   ┌──────▼──────┐
│   Wallet   │              │ StreakCycle │   │  AuditLog   │
└─────┬──────┘              └──────┬──────┘   └─────────────┘
      │ 1                          │ 1
      │ 1..N                       │ 1..N
┌─────▼───────────────┐     ┌──────▼──────┐
│  WalletTransaction  │     │ StreakClaim ◄──────┐ N:1
└─────────────────────┘     └─────────────┘      │
                                          ┌──────┴──────┐
                                          │ StreakReward│
                                          └─────────────┘
```

---

## 2. Models Detail

### 2.1 `User`
Stores authenticated users and credentials.
- `_id`: ObjectId (Primary Key)
- `name`: String, required (max 60)
- `email`: String, required, unique, lowercase, trimmed
- `password`: String, required (hashed with bcrypt 10 rounds)
- `avatar`: String (URL)
- `role`: String, enum `['user', 'admin']`, default `'user'`
- `isActive`: Boolean, default `true`
- `lastLoginAt`: Date
- Timestamps: `createdAt`, `updatedAt`

### 2.2 `Wallet`
Maintains user balances and Amazon digital gift card vouchers.
- `_id`: ObjectId
- `userId`: ObjectId, ref `User`, unique, indexed
- `veBalance`: Number, default `0`, min `0`
- `totalVeEarned`: Number, default `0`
- `amazonGiftCards`: Array of subdocuments:
  - `code`: String, required (e.g. `AMZ-7X9B-4K1L-9Q2M`)
  - `amount`: Number, required (e.g. 1, 2, 5)
  - `currency`: String, default `'INR'`
  - `pin`: String (e.g. `7829`)
  - `claimId`: ObjectId, ref `StreakClaim`
  - `claimedAt`: Date, default `Date.now`
  - `isRedeemed`: Boolean, default `false`
- `totalAmazonEarned`: Number, default `0`
- Timestamps: `createdAt`, `updatedAt`

### 2.3 `StreakConfig`
Global configuration for cycle progression and timeouts.
- `name`: String, default `'default_7_day_cycle'`
- `cycleLength`: Number, default `7`
- `cooldownHours`: Number, default `24`
- `missedWindowHours`: Number, default `48`
- `cpaRequired`: Boolean, default `true`
- `isActive`: Boolean, default `true`

### 2.4 `StreakReward`
Configured reward table stored in MongoDB (source of truth).
- `dayNumber`: Number (1 to 7), unique index
- `rewardType`: Enum `['VE', 'AMAZON_GIFT_CARD']`
- `value`: Number (5, 10, 15, 1, 2, 30, 5)
- `currency`: Enum `['VE', 'INR']`
- `title`: String
- `description`: String
- `icon`: String
- `isUltimateReward`: Boolean (true for Day 7)
- `badgeText`: String
- `color`: String (hex)
- `isActive`: Boolean

### 2.5 `StreakCycle`
Tracks each user's current or past 7-day progression.
- `userId`: ObjectId, ref `User`, index
- `cycleNumber`: Number (1, 2, 3...)
- `status`: Enum `['ACTIVE', 'COMPLETED', 'BROKEN']`
- `currentStreak`: Number (0 to 7)
- `lastClaimAt`: Date (timestamp of most recent check-in)
- `nextClaimAt`: Date (cooldown boundary)
- `claimWindowExpiresAt`: Date (48h boundary for missed-day reset)
- `completedAt`: Date
- **Indexes:**
  - `{ userId: 1, cycleNumber: 1 }` (unique)
  - `{ userId: 1, status: 1 }`

### 2.6 `StreakClaim`
Permanent record of every reward claim event.
- `userId`: ObjectId, ref `User`, index
- `cycleId`: ObjectId, ref `StreakCycle`, index
- `cycleNumber`: Number
- `dayNumber`: Number (1 to 7)
- `rewardId`: ObjectId, ref `StreakReward`
- `rewardSnapshot`: Subdocument `{ rewardType, value, currency, title }`
- `cpaStatus`: Enum `['NOT_REQUIRED', 'VERIFIED', 'FAILED']`
- `cpaEngagementSeconds`: Number
- `giftCardCode`: String (populated for Amazon vouchers)
- `ipAddress`: String
- `userAgent`: String
- `claimedAt`: Date, index
- **Duplicate Prevention Index:**
  - `{ userId: 1, cycleId: 1, dayNumber: 1 }` (unique compound index)

### 2.7 `WalletTransaction`
Double-entry ledger for wallet credits and debits.
- `userId`: ObjectId, ref `User`, index
- `walletId`: ObjectId, ref `Wallet`, index
- `type`: Enum `['CREDIT', 'DEBIT']`
- `category`: Enum `['DAILY_STREAK_REWARD', 'BONUS', 'REDEMPTION']`
- `amount`: Number
- `currency`: Enum `['VE', 'INR_GIFT_CARD', 'INR']`
- `description`: String
- `referenceId`: ObjectId (StreakClaim ID)
- `balanceAfter`: Number
- `metadata`: Map
- **Index:** `{ userId: 1, createdAt: -1 }`

### 2.8 `AuditLog`
Security and operational auditing.
- `userId`: ObjectId (optional)
- `action`: String (e.g. `'REWARD_CLAIMED'`, `'STREAK_RESET_MISSED_DAY'`)
- `metadata`: Mixed
- `ipAddress`: String
- `userAgent`: String
- `status`: Enum `['SUCCESS', 'FAILURE', 'WARNING']`
- `createdAt`: Date, index

---

## 3. Atomic Operations & Idempotency
- **Wallet Balances:** Uses MongoDB `$inc` for atomic balance updates, eliminating race condition losses.
- **Unique Constraint:** If multiple simultaneous API requests try to claim the same day within a cycle, MongoDB throws duplicate key code `11000`, which our centralized error handler catches and translates into a friendly rejection message.
