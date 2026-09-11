# Astra Hackathon 2026 🚀

Welcome to the official web portal for **Astra Hackathon 2026**, organized by **NRI Institute of Technology (NRIIT)** in collaboration with **MTX** and conducted by the **Coding Club**.

---

## 🌟 Key Features

### 1. Live Interactive Google Form Registration
- Embedded registration form directly inside the portal with zero layout shifts and custom responsive styling.
- **Smart Submission Detection & Redirect**: When a team submits their Google Form registration, the portal automatically senses the submission and redirects them straight to the **Track Application** page.

### 2. Full-Screen Interactive WebGL PixelSnow Background
- Powered by **Three.js** and GPU fragment/vertex shaders (`PixelSnow`).
- Renders a cosmic digital snow effect behind the glassmorphic HUD cards on the Track Application page.

### 3. Live Google Apps Script Application Tracking
- Real-time connection to Google Apps Script API endpoint:
  ```
  https://script.google.com/macros/s/AKfycbxEaTgkR0JXt7HW6R-BOlovljWKC4WviDHBv5VzArmpMmfrrUsfc_U6xupv8Viv7M9LWA/exec
  ```
- Instant lookup by Application ID (e.g., `ASTRA-2026-TEAM001`).
- Displays team information, lead name, member count, and multi-stage status progression:
  1. `APPLICATION SUBMITTED`
  2. `APPLICATION UNDER REVIEW`
  3. `SHORTLISTED`
  4. `CONFIRMED`
  5. `HACKATHON PARTICIPATION`

### 4. Cybersecurity Rate Limiting & Input Protection
- **Per-ID Tracking Policy**: Each Application ID can only be verified a maximum of **2 times**. Attempting to check a 3rd time blocks the query and presents a clear security advisory.
- **Input Sanitization**: Automatically strips script injection characters (`<`, `>`, `'`, `"`, `;`, etc.) and normalizes uppercase alphanumeric keys.
- **Data Protection**: Automatically masks sensitive contact information for public viewers.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS + Custom Cosmic Glassmorphism
- **Shaders & 3D**: Three.js (WebGL Shaders)
- **Icons**: Lucide React + Material Symbols Outlined
- **Animations**: Framer Motion + Canvas Confetti
- **Backend**: Google Apps Script Web App (Serverless)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Installation
```bash
# Clone the repository
git clone https://github.com/sharma0527/Astra-Hackthon-website.git
cd Astra-Hackthon-website

# Install dependencies
npm install
```

### Local Development
```bash
npm run dev
```
Open your browser at [http://localhost:5173](http://localhost:5173).

### Production Build
```bash
npm run build
```

---

## 🌐 Vercel Deployment Guide

1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"** -> **"Import Git Repository"**.
3. Select `Astra-Hackthon-website`.
4. **Environment Variables (Optional)**:
   The website is preconfigured with the live Google Apps Script endpoint as a built-in fallback. If you want to override or manage it from Vercel:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://script.google.com/macros/s/AKfycbxEaTgkR0JXt7HW6R-BOlovljWKC4WviDHBv5VzArmpMmfrrUsfc_U6xupv8Viv7M9LWA/exec`
   - Enable for **Production**, **Preview**, and **Development**.
5. Click **Deploy**.

---

## 🏛️ Event Details & Venue

- **Event**: Astra Hackathon 2026 (12-Hour National Hackathon)
- **Date**: 21-09-2026
- **Organized By**: NRI Institute of Technology (NRIIT) × MTX
- **Conducted By**: Coding Club (Created by ch.ch.sharma)
- **Location**: Guntur, Andhra Pradesh (Perecharla & Medikondoru Mandal areas)
