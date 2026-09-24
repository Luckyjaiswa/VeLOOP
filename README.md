# ⚡ VELoop Rewards – Daily Streak & Rewards System

A full-stack, production-ready MERN web application featuring a consecutive daily streak cycle, server-controlled rewards, atomic duplicate-claim protection, CPA demo verification, digital wallet with Amazon Gift Card vouchers, and an ultra-premium dark violet aesthetic.

---

## 🌟 Key Features

- **7-Day Consecutive Streak Cycle:**
  - **Day 1:** +5 VEs
  - **Day 2:** +10 VEs
  - **Day 3:** +15 VEs
  - **Day 4:** ₹1 Amazon Gift Card Voucher
  - **Day 5:** ₹2 Amazon Gift Card Voucher
  - **Day 6:** +30 VEs
  - **Day 7:** 🏆 ₹5 Amazon Gift Card (Ultimate Grand Prize)
- **100% Server Authority:** Reward values, eligibility, streaks, cooldown timers, and user balances are stored in MongoDB. The client cannot spoof rewards, days, or timers.
- **Atomic Duplicate Protection:** In-memory lock per user + MongoDB compound unique constraint (`{ userId, cycleId, dayNumber }`) strictly prevents double-clicks and multi-tab race condition claims.
- **Missed Day Detection:** Automatically resets streak to Day 1 if the 48-hour claim window expires without affecting already earned wallet credits.
- **Real-Time Synchronized Cooldown:** Ticking countdown synced with server time; re-verifies automatically against the backend when it hits zero.
- **CPA Demo Verification Flow:** Interactive sponsor verification step with animated engagement progress before payout.
- **Digital Wallet & Amazon Vouchers:** Full transaction ledger with copyable unique gift card codes (`AMZ-XXXX-XXXX-XXXX`) and one-click redemption tracking.
- **Interactive Dev Simulation Controls:** Floating developer bar allowing instantaneous 24-hour fast-forward and missed-day testing directly in the browser!
- **Premium VELoop Dark UI:** Violet/purple neon glows, gold reward accents, shimmer skeleton loaders, confetti explosion celebrations, responsive design from 320px to 1920px.

---

## 📁 Complete Folder Structure

```
d:/VELoop project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── streakController.js
│   │   │   └── walletController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Wallet.js
│   │   │   ├── StreakConfig.js
│   │   │   ├── StreakReward.js
│   │   │   ├── StreakCycle.js
│   │   │   ├── StreakClaim.js
│   │   │   ├── WalletTransaction.js
│   │   │   └── AuditLog.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── streakRoutes.js
│   │   │   └── walletRoutes.js
│   │   ├── services/
│   │   │   ├── auditService.js
│   │   │   ├── streakService.js
│   │   │   └── walletService.js
│   │   ├── utils/
│   │   │   ├── seedData.js
│   │   │   └── token.js
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   │   └── streakSecurity.test.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── seed.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ClaimModal.jsx
│   │   │   ├── CpaDemo.jsx
│   │   │   ├── DevControls.jsx
│   │   │   ├── HeroBanner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RewardCard.jsx
│   │   │   ├── RewardGrid.jsx
│   │   │   ├── StreakHeader.jsx
│   │   │   ├── StreakLoader.jsx
│   │   │   ├── StreakSkeleton.jsx
│   │   │   ├── StreakStats.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── TrustFooter.jsx
│   │   │   ├── UltimateReward.jsx
│   │   │   └── WhyStreak.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── hooks/
│   │   │   └── useCountdown.js
│   │   ├── pages/
│   │   │   ├── DailyStreak/
│   │   │   │   ├── DailyStreak.module.css
│   │   │   │   └── DailyStreakPage.jsx
│   │   │   ├── History/
│   │   │   │   └── HistoryPage.jsx
│   │   │   ├── Login/
│   │   │   │   └── LoginPage.jsx
│   │   │   ├── NotFound/
│   │   │   │   └── NotFoundPage.jsx
│   │   │   ├── Profile/
│   │   │   │   └── ProfilePage.jsx
│   │   │   ├── Register/
│   │   │   │   └── RegisterPage.jsx
│   │   │   └── Wallet/
│   │   │       └── WalletPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── streakApi.js
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── API_DOCUMENTATION.md
├── DATABASE.md
├── SECURITY.md
├── TESTING.md
├── .env.example
├── README.md
└── package.json
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/veloop_rewards
JWT_SECRET=veloop_super_secret_jwt_key_2026_secure_streak_token
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Quickstart & Local Setup

### 1. Install Dependencies
Run from the root directory:
```bash
npm run install:all
```
*(Or run `npm install` inside root, `backend/`, and `frontend/`)*

### 2. Seed Database
Seed the 7 default streak rewards and the demo user:
```bash
npm run seed
```

Demo User Credentials:
- **Email:** `demo@veloop.com`
- **Password:** `Password123!`

### 3. Run Locally in Development Mode
Start both Backend and Frontend concurrently with a single command:
```bash
npm run dev
```

- **Frontend Application:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/api/health`

### 4. Run Automated Security Tests
```bash
npm run test
```

---

## 🍃 MongoDB Setup Options

### Option A: Local MongoDB (Default)
Ensure MongoDB Server is running on your machine:
```bash
# Windows
net start MongoDB
# Linux/macOS
brew services start mongodb-community
```
Connection string: `mongodb://127.0.0.1:27017/veloop_rewards`

### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free M0 cluster.
2. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere).
3. Under **Database Access**, create a user with read/write privileges.
4. Copy your connection URI and update `backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/veloop_rewards?retryWrites=true&w=majority
   ```
5. Run `npm run seed` to initialize rewards in Atlas.

---

## 📦 GitHub Upload Instructions

```bash
git init
git add .
git commit -m "feat: complete production-ready VELoop Rewards streak system"
git branch -M main
git remote add origin https://github.com/<your-username>/veloop-rewards-streak-system.git
git push -u origin main
```

---

## 🚀 Deployment Instructions

### 1. Backend Deployment (Render / Railway)

#### On Render.com:
1. Connect your GitHub repository.
2. Choose **Web Service**.
3. Set **Root Directory:** `backend`
4. Set **Build Command:** `npm install`
5. Set **Start Command:** `npm start`
6. Add Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `<Your MongoDB Atlas URI>`
   - `JWT_SECRET`: `<Your Secure Random String>`
   - `CORS_ORIGIN`: `https://your-frontend.vercel.app`

#### On Railway.app:
1. Click **New Project** -> **Deploy from GitHub repo**.
2. Select your repository and specify `backend` as the root directory.
3. Configure the same environment variables under the **Variables** tab.

---

### 2. Frontend Deployment (Vercel)

1. Connect your GitHub repository on [Vercel](https://vercel.com).
2. Set **Framework Preset:** `Vite`
3. Set **Root Directory:** `frontend`
4. Set **Build Command:** `npm run build`
5. Set **Output Directory:** `dist`
6. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend.onrender.com`
7. Click **Deploy**.

---

## 📄 License & Credits
Developed for **VELoop Rewards Ecosystem**. All rights reserved.
