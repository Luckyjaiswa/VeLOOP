# 📡 VELoop Rewards – API Documentation

All protected endpoints require an `Authorization: Bearer <JWT_TOKEN>` header. The user identity is extracted purely from the verified JWT payload; user identifiers or claim parameters sent from the client are never trusted.

Base URL (Local): `http://localhost:5000`

---

## 🔐 1. Authentication Endpoints

### 1.1 Register User
- **Route:** `POST /api/auth/register`
- **Access:** Public (Rate limited: 50 req/15min)
- **Request Body:**
  ```json
  {
    "name": "Alex Rivera",
    "email": "demo@veloop.com",
    "password": "Password123!"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Account created successfully! Welcome to VELoop Rewards.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "6793e7...",
      "name": "Alex Rivera",
      "email": "demo@veloop.com",
      "role": "user",
      "avatar": "https://..."
    },
    "wallet": {
      "veBalance": 0,
      "totalAmazonEarned": 0
    }
  }
  ```

### 1.2 Login User
- **Route:** `POST /api/auth/login`
- **Access:** Public (Rate limited: 50 req/15min)
- **Request Body:**
  ```json
  {
    "email": "demo@veloop.com",
    "password": "Password123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Signed in successfully!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "6793e7...",
      "name": "Alex Rivera",
      "email": "demo@veloop.com"
    },
    "wallet": {
      "veBalance": 50,
      "totalAmazonEarned": 0
    }
  }
  ```

### 1.3 Get Current User Session
- **Route:** `GET /api/auth/me`
- **Access:** Private (Bearer Token)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "id": "6793e7...",
      "name": "Alex Rivera",
      "email": "demo@veloop.com",
      "role": "user",
      "createdAt": "2026-09-24T10:00:00.000Z"
    },
    "wallet": {
      "veBalance": 55,
      "totalVeEarned": 55,
      "totalAmazonEarned": 0
    }
  }
  ```

### 1.4 Update Profile
- **Route:** `PUT /api/auth/profile`
- **Access:** Private
- **Request Body:** `{ "name": "Alexander Rivera" }`
- **Response (200 OK):** Updated user profile.

---

## 🔥 2. Daily Streak Endpoints

### 2.1 Get Full Streak Dashboard
- **Route:** `GET /api/daily-streak`
- **Access:** Private
- **Description:** Returns the active cycle, streak count, countdown timestamps, server time, statistics, and all 7 reward cards evaluated with their dynamic states: `CLAIMED`, `AVAILABLE`, `TODAY`, `LOCKED`, or `MISSED`.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "serverTime": "2026-09-24T10:15:30.000Z",
      "cycle": {
        "id": "6793e8...",
        "cycleNumber": 1,
        "status": "ACTIVE",
        "currentStreak": 1,
        "lastClaimAt": "2026-09-24T10:10:00.000Z",
        "nextClaimAt": "2026-09-25T10:10:00.000Z",
        "claimWindowExpiresAt": "2026-09-26T10:10:00.000Z"
      },
      "config": {
        "cycleLength": 7,
        "cooldownHours": 24,
        "missedWindowHours": 48,
        "cpaRequired": true
      },
      "eligibility": {
        "canClaim": false,
        "currentDay": 2,
        "remainingCooldownMs": 86070000,
        "remainingWindowMs": 172470000
      },
      "stats": {
        "currentStreak": 1,
        "totalRewardsClaimed": 1,
        "completedCycles": 0,
        "nextReward": {
          "day": 2,
          "value": 10,
          "currency": "VE",
          "title": "+10 VEs",
          "rewardType": "VE"
        }
      },
      "days": [
        {
          "dayNumber": 1,
          "title": "+5 VEs",
          "rewardType": "VE",
          "value": 5,
          "currency": "VE",
          "state": "CLAIMED",
          "isCurrentDay": false
        },
        {
          "dayNumber": 2,
          "title": "+10 VEs",
          "rewardType": "VE",
          "value": 10,
          "currency": "VE",
          "state": "TODAY",
          "isCurrentDay": true
        },
        {
          "dayNumber": 3,
          "title": "+15 VEs",
          "state": "LOCKED"
        },
        {
          "dayNumber": 4,
          "title": "₹1 Amazon Gift Card",
          "rewardType": "AMAZON_GIFT_CARD",
          "value": 1,
          "currency": "INR",
          "state": "LOCKED"
        },
        {
          "dayNumber": 5,
          "title": "₹2 Amazon Gift Card",
          "rewardType": "AMAZON_GIFT_CARD",
          "value": 2,
          "currency": "INR",
          "state": "LOCKED"
        },
        {
          "dayNumber": 6,
          "title": "+30 VEs",
          "state": "LOCKED"
        },
        {
          "dayNumber": 7,
          "title": "₹5 Amazon Gift Card",
          "rewardType": "AMAZON_GIFT_CARD",
          "value": 5,
          "currency": "INR",
          "isUltimateReward": true,
          "state": "LOCKED"
        }
      ]
    }
  }
  ```

### 2.2 Get Lightweight Streak Status
- **Route:** `GET /api/daily-streak/status`
- **Access:** Private
- **Description:** Optimized lightweight endpoint used by the frontend timer when countdown hits zero to verify whether the cooldown has elapsed and the next reward is unlocked.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "serverTime": "2026-09-24T10:15:30.000Z",
    "canClaim": true,
    "currentStreak": 1,
    "currentDay": 2,
    "nextClaimAt": "2026-09-24T10:15:00.000Z",
    "claimWindowExpiresAt": "2026-09-25T10:15:00.000Z",
    "remainingCooldownMs": 0
  }
  ```

### 2.3 Claim Daily Streak Reward
- **Route:** `POST /api/daily-streak/claim`
- **Access:** Private (Rate limited: 30 attempts/min)
- **Request Body:**
  ```json
  {
    "cpaToken": "cpa_demo_verified_1790245890",
    "cpaEngagementSeconds": 3
  }
  ```
- **Claim Process:**
  1. Authenticates user from JWT
  2. Reads current server time
  3. Acquires per-user memory lock (prevents concurrent clicks / multi-tab attacks)
  4. Evaluates cycle & streak eligibility
  5. Checks 48h missed window (resets to Day 1 if expired)
  6. Checks whether reward was already claimed
  7. Reads reward definition directly from MongoDB `StreakReward`
  8. Validates CPA demo token
  9. Credits `Wallet` atomically
  10. Creates `WalletTransaction`
  11. Creates `StreakClaim` (protected by MongoDB compound unique index `{ userId: 1, cycleId: 1, dayNumber: 1 }`)
  12. Advances streak and resets cooldown timers
  13. Writes `AuditLog`
  14. Returns updated streak and wallet balances
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Congratulations! Day 1 reward claimed successfully!",
    "claimedReward": {
      "dayNumber": 1,
      "title": "+5 VEs",
      "value": 5,
      "rewardType": "VE",
      "currency": "VE",
      "giftCardCode": null,
      "isUltimateReward": false
    },
    "wallet": {
      "veBalance": 55,
      "totalVeEarned": 55,
      "totalAmazonEarned": 0
    },
    "dashboard": { ... }
  }
  ```

### 2.4 Get Reward Claim History
- **Route:** `GET /api/daily-streak/history?page=1&limit=15`
- **Access:** Private
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "total": 1,
    "page": 1,
    "pages": 1,
    "data": [
      {
        "_id": "6793e9...",
        "cycleNumber": 1,
        "dayNumber": 1,
        "rewardSnapshot": {
          "rewardType": "VE",
          "value": 5,
          "currency": "VE",
          "title": "+5 VEs"
        },
        "cpaStatus": "VERIFIED",
        "giftCardCode": null,
        "claimedAt": "2026-09-24T10:10:00.000Z"
      }
    ]
  }
  ```

---

## 💰 3. Wallet Endpoints

### 3.1 Get Wallet Summary & Transactions
- **Route:** `GET /api/wallet`
- **Access:** Private
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "veBalance": 55,
      "totalVeEarned": 55,
      "totalAmazonEarned": 5,
      "amazonGiftCards": [
        {
          "_id": "6793ea...",
          "code": "AMZ-7X9B-4K1L-9Q2M",
          "amount": 5,
          "currency": "INR",
          "pin": "7829",
          "isRedeemed": false,
          "claimedAt": "2026-09-24T10:12:00.000Z"
        }
      ],
      "transactions": [
        {
          "_id": "6793eb...",
          "type": "CREDIT",
          "category": "DAILY_STREAK_REWARD",
          "amount": 5,
          "currency": "VE",
          "description": "Daily Streak Day 1 reward: +5 VEs",
          "balanceAfter": 55,
          "createdAt": "2026-09-24T10:10:00.000Z"
        }
      ]
    }
  }
  ```

### 3.2 Redeem Amazon Voucher
- **Route:** `POST /api/wallet/redeem/:id`
- **Access:** Private
- **Description:** Marks a voucher as redeemed once the user applies the code into their Amazon Pay balance.

---

## 🧪 4. Developer Simulation Endpoints

- `POST /api/daily-streak/dev-advance-day`: Advances the server cooldown to make the subsequent day available immediately (used for rapid test cycles).
- `POST /api/daily-streak/dev-simulate-missed`: Forces the claim window to expire, triggering a streak break and resetting streak back to Day 1.
