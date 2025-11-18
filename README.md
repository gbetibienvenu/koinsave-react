# Koinsave — Frontend (Single-repo)

**React (Vite) + json-server (served with Express)**

This is a full-stack project (frontend + mock backend) bundled in one repository. This README provides clear instructions on how to set up, run, test, and deploy the Koinsave practical pre-interview project. It documents all features, troubleshooting tips, and deployment instructions.
---
## 1. Project Summary & Features
Koinsave is a clean and minimal frontend application built with **React + Vite**, featuring a mock JSON API powered by **json-server**. This repository combines both the frontend and mock backend, allowing you to run everything from a single service.

### Main Features Implemented:
- **Authentication (Login / Signup)** with JSON-server (mock backend)
- **Dashboard** displaying user balance and recent transactions
- **Send Money Modal** with recipient validation, amount validation, and optional short message
- **Deposit Modal** (deposit from UI without manually editing the database)
- **Transactions** include full date + time timestamps
- **Profile Picture Upload** (stored as Base64 in `db.json` and displayed on Dashboard)
- **Responsive UI** using Tailwind CSS
- **Error and Success Messages** displayed for API interactions
- **Single-repo Production Server**: Express serves the built frontend and mounts json-server at `/api`
---

## 2. Repository Structure (Important Files)
```
/ (repo root)
│
├─ src/
│  ├─ api/
│  │  ├─ axios.js            # Axios instance using VITE_API_BASE
│  ├─ components/
│  │  ├─ SendModal.jsx
│  │  ├─ DepositModal.jsx
│  ├─ pages/
│  │  ├─ Dashboard.jsx
│  │  ├─ Login.jsx
│  │  ├─ Signup.jsx
│  ├─ utils/
│  │  ├─ auth.js             # AuthProvider (useAuth)
│  └─ main.jsx
├─ db.json                    # Mock database used by json-server
├─ server.cjs                 # Express server that mounts json-server and serves build/
├─ package.json
├─ vite.config.js
└─ README.md
```

---

## 3. Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js v18+** (recommended)
- **npm**
- **Git** (to clone/push repositories)
---

## 4. Local Setup — Install & Run (Dev)

These instructions assume you are in the project root directory.

### 4.1 Install Dependencies
```bash
# Clean install (recommended)
rm -rf node_modules package-lock.json   # macOS / Linux
# On Windows use Explorer or: rd /s /q node_modules & del package-lock.json
npm install
```

### 4.2 Development Mode (Frontend Only)

If you want to run only the frontend in development mode (it will call the local json-server or your `/api`):
```bash
# Run frontend dev server (Vite)
npm run dev

# Open http://localhost:5173
```

If you want to run the JSON server separately in development:
```bash
# Start json-server on port 4000
npm run start:api

# This exposes endpoints like /users, /transactions, etc.
```
### 4.3 Production-like Local Server (Frontend + API in One)

This starts the Express server that serves the built frontend and mounts json-server at `/api`:

**Step 1:** Build the frontend
```bash
npm run build
```

**Step 2:** Start the server
```bash
npm start

# Server listens on PORT environment variable or defaults to 4000
# Open http://localhost:4000
# API endpoints available at http://localhost:4000/api/users
```

---

## 5. Environment Variables (.env)

Use Vite environment variables to configure the API base URL:

### `.env.local` (Development)
```
VITE_API_BASE=http://localhost:4000/api
```

### `.env.production` (Production)
```
VITE_API_BASE=/api
```

**Note:** `src/api/axios.js` uses `import.meta.env.VITE_API_BASE || 'http://localhost:4000'`. In production, when the server serves the API at `/api`, `VITE_API_BASE=/api` is the correct configuration.
---

## 6. How the API Works (Endpoints)

The server mounts json-server under `/api`. Here are the available endpoints:

- `GET /api/users` — List all users (supports query params like `?email=...`)
- `GET /api/users/:id` — Get a specific user by ID
- `POST /api/users` — Create a new user (signup)
- `PATCH /api/users/:id` — Update a user (deposit, profile picture, transactions)
- `PUT /api/users/:id` — Replace a user
- `DELETE /api/users/:id` — Delete a user

**Note:** Transactions are stored as an array under a user's `transactions` field in `db.json`.

---
## 7. UI Flows & Features Checklist (What's Implemented)

This checklist was used for the pre-interview task verification. Ticked items indicate implemented features:

### Authentication UI
- ✅ Login screen
- ✅ Signup screen
- ✅ Mock API integration (`/api/users`)
- ✅ Basic form validation & error messages

### Dashboard
- ✅ User balance displayed (currency formatted)
- ✅ Recent transactions listed (with color-coded amounts)

### Send Money Modal
- ✅ Amount validation
- ✅ Recipient existence validation
- ✅ Message/note field included
- ✅ Prevent self-transfer
- ✅ Updates both sender and recipient in `db.json`
- ✅ Transactions use full date+time timestamp

### Deposit Modal
- ✅ Deposit from UI
- ✅ Updates user balance and transaction (full date+time)

### Responsive Layout
- ✅ Mobile + desktop responsive design

### Profile Picture Upload
- ✅ Profile picture upload (Base64) on Dashboard

### API Integration & UX
- ✅ Axios instance (environment-driven base URL)
- ✅ Error & success messages displayed
- ⚠️ Loading spinners (optional improvement)

## 8. Deployment — Single Repo (Serve Build + API)

The repository includes `server.cjs` that performs the following:

- Builds and serves the React app
- Mounts json-server at `/api`

1. Connect to your GitHub repository
2. **Build command:** `npm install` (Render runs `postinstall -> npm run build` automatically if postinstall exists)
3. **Start command:** `npm start`
4. **Port:** Render sets the `PORT` environment variable automatically (the server uses `process.env.PORT`)

Render will run `npm install`, build your project, and start your server.

**Backend:**
1. Deploy backend as a Render Web Service
2. Start command: `npm run start:api` or use the single-repo method above

**Frontend:**
1. Deploy frontend to Vercel (link your GitHub repo)
2. Set `VITE_API_BASE` to your backend URL in Vercel environment variables:
```
   VITE_API_BASE=https://<your-backend-name>.onrender.com/api
```
**Fix:**
```bash
npm install json-server express --save

# Or install specific versions:
npm install express@4.18.2 json-server@0.17.3 --save
```
---
### Issue: PostCSS / Tailwind Errors (Vite)

**Symptoms:** Error messages about PostCSS config or `tailwindcss` plugin.

**Fix:** Install the correct PostCSS plugin for Tailwind version:
```bash
npm install -D @tailwindcss/postcss postcss@8
```

If `postcss.config.js` is a CommonJS file while `type: module` is set, rename it to `postcss.config.cjs` or convert it to ESM format.
---
### Issue: `setUser is not a function` (Runtime)

**Cause:** Auth context did not expose `setUser`.

**Fix:** Ensure `AuthProvider` returns `{ user, setUser, login, signup, logout, updateProfilePic }`.

Example in `src/utils/auth.js`:
```javascript
return (  
    {children}
);
```
## 11. Quick Start Checklist
```bash
# 1. Install dependencies
npm install

# 2. Build (Vite)
npm run build

# 3. Start local production server (Express + json-server)
npm start

# Visit:
# - Frontend: http://localhost:4000
# - API: http://localhost:4000/api/users
```
---
## 12. Appendix — Useful File Snippets
### `server.cjs` (Single-repo Server)
```javascript
const path = require('path');
const express = require('express');
const { createServer } = require('http');
const jsonServer = require('json-server');

const app = express();
const httpServer = createServer(app);

// JSON Server
const apiRouter = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({ static: false });

app.use('/api', middlewares);
app.use('/api', jsonServer.bodyParser);
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/api', apiRouter);

// Serve React static build (Vite -> dist OR build)
// If Vite outputs to 'dist', change 'build' to 'dist' below
const buildPath = path.join(__dirname, 'dist'); // or 'build' if using CRA
app.use(express.static(buildPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).send({ error: 'API route not found' });
  }
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
```
**Note:** Adjust `buildPath` to `dist` if using Vite's default output. (Vite's default output folder is `dist`.)
---

## 🚀 Deployment Status

The project was previously deployed on **Render**, and the live API was accessible at:

https://koinsave-api.onrender.com/users

However, the deployment was **automatically removed by Render** because the free trial plan expired.  
All deployment configurations remain in the repository, and the project can be redeployed at any time on Render or any preferred hosting platform.
