# 🧪 Testing Guide: VELoop Rewards Daily Streak System

This guide outlines both automated test suites and interactive verification flows.

---

## 🚀 1. Automated Security & Logic Test Suite

The automated test runner executes 17 comprehensive security and logic checks directly against MongoDB:

```bash
cd backend
npm test
# Or from root:
npm run test
```

### What is tested automatically:
1. `Test 1.1`: Day 1 is eligible for new registered user.
2. `Test 1.2`: Day 1 card state evaluates to `AVAILABLE`.
3. `Test 1.3`: Day 2 card state evaluates to `LOCKED`.
4. `Test 2.1`: Day 1 claim executes successfully.
5. `Test 2.2`: Claimed reward is strictly Day 1.
6. `Test 2.3`: Reward value is 5 VEs loaded from MongoDB (ignoring frontend inputs).
7. `Test 2.4`: Wallet is credited with exactly +5 VEs.
8. `Test 3.1`: Immediate second claim is blocked with `REWARD_LOCKED`.
9. `Test 3.2`: Duplicate claim attempt is rejected without double crediting.
10. `Test 4.1`: Reward type is strictly enforced from MongoDB.
11. `Test 5.1`: Other user's streak remains 0 (per-user isolation).
12. `Test 6.1`: Day 2 becomes available after cooldown.
13. `Test 6.2`: Day 2 state transitions to `AVAILABLE`.
14. `Test 6.3`: Day 1 state transitions to `CLAIMED`.
15. `Test 6.4`: Day 2 claimed successfully.
16. `Test 6.5`: Day 2 value is 10 VEs.
17. `Test 6.6`: Total wallet VE balance becomes 15 VEs (5 + 10).

---

## 🖥️ 2. Interactive End-to-End Testing (In-Browser)

### A. Testing the 7-Day Cycle in 60 Seconds
1. Open `http://localhost:5173/login`.
2. Click **Use Demo Account (Alex Rivera)** and click **Sign In**.
3. On the dashboard, observe Day 1 is **AVAILABLE**.
4. Click **Claim Day 1 Reward**, watch the CPA verification, and complete the claim (+5 VEs).
5. Open the **Dev Simulation Bar** at the bottom left.
6. Click **Fast-Forward 24h Cooldown**. Notice that Day 2 (+10 VEs) immediately unlocks to **AVAILABLE**.
7. Claim Day 2 (+10 VEs).
8. Fast-forward again to claim Day 3 (+15 VEs).
9. Fast-forward to claim Day 4 (**₹1 Amazon Gift Card**).
10. Fast-forward to claim Day 5 (**₹2 Amazon Gift Card**).
11. Fast-forward to claim Day 6 (+30 VEs).
12. Fast-forward to claim Day 7 (**₹5 Amazon Gift Card - Ultimate Grand Prize!**).
13. Observe the confetti explosion and navigate to `/wallet` to see your collection of Amazon Gift Card vouchers with unique redeemable codes!

---

### B. Testing the Missed Day Streak Reset
1. Maintain an active streak of 1 or more days.
2. In the **Dev Simulation Bar**, click **Simulate Missed Day (Reset to Day 1)**.
3. Observe:
   - The current cycle is marked broken.
   - A new streak cycle automatically begins.
   - Current Streak resets to **0 Days**.
   - Day 1 becomes **AVAILABLE** again.
   - Previously accumulated wallet balances and vouchers remain safely intact in your wallet.

---

### C. Testing Responsive Layouts
Test viewports across common device widths:
- **320px – 375px:** iPhone SE / small mobile (single-column cards, drawer menu).
- **390px – 480px:** iPhone 13/14/15, Pixel, Galaxy (optimized 2-column grid).
- **768px – 820px:** iPad Mini / Tablets (3-4 column grid, top balance pills).
- **1024px – 1920px:** Laptops, Desktops, Ultrawide screens (full 7-column pathway).
