# 🛡️ Security Architecture & Anti-Fraud Mitigations

The VELoop Rewards Daily Streak System implements defense-in-depth principles to prevent cheating, financial duplication, clock tampering, and session spoofing.

---

## 🔒 1. Threat Mitigation Matrix

| Threat | Attack Vector | VELoop Architectural Defense |
|---|---|---|
| **DevTools Streak Manipulation** | Attacker edits local React state or DOM elements to show Day 7 unlocked. | **Server Authority:** The frontend never decides what day or reward is available. The backend computes eligibility on every call from `StreakCycle` in MongoDB. |
| **Tampered Reward Amount** | Attacker modifies API request payload to send `value: 99999` or `currency: INR`. | **Zero Client Trust:** The `/claim` API takes **no reward amounts or types** from the request body. Reward definition is loaded strictly from the `StreakReward` database model. |
| **Fake Day Number** | Attacker calls `/claim` with `{ dayNumber: 7 }` on Day 1. | **Ignored Input:** Day calculation is computed server-side as `cycle.currentStreak + 1`. Client cannot specify day number. |
| **Fake User ID Spoofing** | Attacker sends another user's `userId` in the body or header. | **Cryptographic Identity:** `userId` is extracted exclusively from the cryptographically verified JWT (`req.user = await User.findById(decoded.id)`). Any body `userId` is ignored. |
| **Duplicate Claim / Double Clicks** | Attacker rapidly double clicks the "Claim" button. | **Dual-Layer Protection:** (1) In-memory mutex lock `userClaimLocks.has(userId)` rejects overlapping concurrent requests with HTTP 429. (2) Database compound unique index `{ userId: 1, cycleId: 1, dayNumber: 1 }` rejects duplicate writes. |
| **Multi-Tab Concurrent Claim** | Attacker opens 5 tabs and clicks Claim simultaneously. | The memory mutex and MongoDB unique index guarantee only 1 claim can ever commit. The other 4 fail with duplicate error code. |
| **Claiming Locked Reward** | Attacker scripts `/claim` during the 24-hour cooldown period. | Backend compares server `now` against `cycle.nextClaimAt`. If `now < nextClaimAt`, returns HTTP 400 `REWARD_LOCKED`. |
| **Claiming Another User's Reward** | Attacker tries to steal another player's claimed reward. | Claims and wallet transactions are bound to the verified JWT user ID. Users can neither read nor claim other users' streaks. |
| **Device Clock Manipulation** | User changes mobile or Windows system clock 24 hours ahead. | **Server-Side Clock:** All timestamps (`serverTime`, `nextClaimAt`, `claimWindowExpiresAt`) are derived from the Node.js server system clock (`new Date()`). Client clock changes have zero effect. |
| **Password Theft** | Database breach attempts. | Passwords hashed using `bcryptjs` with salt round 10. `select: false` ensures password hashes are never returned in queries by default. |

---

## 🛡️ 2. Rate Limiting & DoS Protection

- **Auth Limiter:** Max 50 authentication attempts per 15 minutes per IP (`express-rate-limit`).
- **Claim Limiter:** Max 30 claim attempts per minute per IP.
- **Helmet:** Enforces HTTP security headers, XSS filter, and clickjacking protection.
- **CORS Protection:** Configurable whitelist restricting access to approved frontend origins.

---

## 🔍 3. Automated Security Verification

An automated security test suite is located at `backend/tests/streakSecurity.test.js`.
To run tests:
```bash
npm run test
```
All 17 automated security assertions must pass before production deployment.
