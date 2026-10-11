# BuildNear - Frontend Web Application

High-performance, modern Single-Page Application (SPA) for **BuildNear** (Local Construction & Interior Services Marketplace).

## Tech Stack
- **Framework:** React 19 + Vite 8
- **Routing:** React Router v7
- **Styling:** Custom Modular CSS Architecture (`index.css`)
- **HTTP Client:** Axios with JWT request/response interceptors
- **Icons:** Lucide React

---

## Features
- **Dynamic Geo-Location Hubs:** GPS detection + 35 Indian state/city hubs.
- **Search & Filter:** Trades (Electrician, Plumber, Mason, Architect, etc.), rating, price, experience, and keywords (Vastu, AAC blocks, 3-phase, etc.).
- **Interactive Modules:** Direct booking, quotation requests & comparisons, transparent estimation calculators.
- **Role Dashboards:** Dedicated workspaces for Customers, Professionals, and Administrators.

---

## Deployment on Vercel

This repository is optimized for one-click deployment on [Vercel](https://vercel.com):

1. **Import Project:** Select `BuildNear-Frontend` from your GitHub account.
2. **Framework Preset:** Vite
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Environment Variables:**
   - `VITE_API_BASE_URL`: `https://<your-backend-url>/api` (or `/api` when proxying)
6. **SPA Routing:** Configured in `vercel.json` to prevent 404s on route refresh.

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Accessible at `http://localhost:5173`.
