<div align="center">

# 🌿 WWF Interactive Wall Calendar 2026

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-purple?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://wallpaper-app-jade.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

### A photorealistic, interactive WWF-themed wall calendar — where nature meets productivity.

**[🌐 Live Demo →](https://wallpaper-app-jade.vercel.app)**

---

*Click any month on the landing page · Explore festivals & events · Create personal reminders · View all your plans in one place*

</div>

---

## ✨ Feature Overview

```
🏠 Landing Page  →  📅 Month Detail  →  🎉 Event Creation  →  📋 All Events
      ↓                    ↓                     ↓                    ↓
 12 month slices     Interactive grid       Title, location,     Beautiful card
 animated drop-in    with festivals         notes & memo         event display
```

---

## 🖼️ Pages & Features

### 1. 🌲 Landing Page — The WWF Wall Calendar

The entry point of the app is a **stunning, physical wall-calendar aesthetic** built entirely with CSS and React.

| Feature | Description |
|---|---|
| 🎞️ **Animated Slice Drop-In** | Each month panel slides down from above with a staggered cubic-bezier animation on page load |
| 🌿 **Forest Photography** | Real WWF-quality forest imagery fills each of the 3 calendar panels, creating a seamless visual across the full calendar width |
| 📖 **4 Quarterly Views** | Browse Q1–Q4 (Jan–Mar, Apr–Jun, Jul–Sep, Oct–Dec) using left/right arrows or the dot navigation |
| 🖱️ **Interactive Month Slices** | Each slice shows the month initial, name, a mini calendar grid, and the Make/IT/GREEN slogan. Hover reveals a bright green border glow and scale effect |
| ✨ **Floating Particles** | 12 subtle green particles float upward continuously in the background, giving the page life |
| 📱 **Mobile Responsive** | On mobile, all 3 slices stack vertically, each showing a different crop of the forest image. The slogan rotates vertically for a clean look |
| 🔢 **Live Mini Calendars** | Every slice renders a real calendar grid for that month with correct start days, weekends highlighted in bright green |

**How to navigate:**
- Use the **← →** navigation arrows to flip between quarters
- Use the **page dots** at the bottom to jump directly to any quarter
- The **Q label** (e.g. *Q1 • January – March*) always shows which quarter you're on

---

### 2. 📅 Month Detail Page — Deep Interactive Calendar

Clicking any month tile on the landing page opens a **full interactive calendar** for that exact month — no extra clicks needed.

> The URL updates to `/calendar?month=X` (0=January … 11=December), so every month is **fully deep-linkable and shareable**.

#### 🗓️ Calendar Grid
- **Realistic page-flip animation** (powered by Framer Motion) when navigating months — feels like turning a real calendar page
- **Today's date** is highlighted with a glowing ring
- Dates outside the current month are softly dimmed
- **S M T W Th F S** header in classic serif typography, exactly like a printed calendar
- Smooth per-cell entrance animations with staggered delays

#### 🎉 Pre-defined Festivals & Holidays
Every national and international holiday is pre-marked on the calendar:

```
🎉 New Year's Day        🌹 Valentine's Day       🤡 April Fool's Day
🙏 Good Friday           🌈 Pride Month           🎃 Halloween
🎆 Independence Day      🎄 Christmas Day         🕎 Hanukkah
🦃 Thanksgiving          🎖️ Veterans Day          + many more...
```

- **Hover any holiday** to see a beautiful tooltip showing the emoji + holiday name
- Holidays are algorithmically mapped — no manual entry needed

#### 🌙 Dark / Light Mode
- Toggle between **dark calendar mode** (deep forest night) and **light mode** with a single click
- Mode persists across page navigation

---

### 3. 📝 Event & Note Creation

#### Date Range Selection
1. **Click any date** to start — it turns white (selected)
2. **Click another date** for a range — all dates in between highlight with a soft translucent band
3. **Click the same date** twice for a single-day event

Once a range is selected, a panel slides in to enter event details:

| Field | Description |
|---|---|
| 📌 **Title** | Short event name (e.g. *Mountain Trek*, *Team Outing*) |
| 📍 **Location** | Where? City, venue, or online |
| 📝 **Description** | Longer notes — what's happening, who's involved, etc. |
| 🗓️ **Date Range** | Automatically filled from your calendar selection |

Events are **saved to your browser's localStorage** — they persist between visits without any account needed.

#### 📓 Monthly Memo
Each month has a dedicated **Monthly Memo** area — a free-form text field where you can:
- Write goals for the month
- Jot down general notes
- Track recurring tasks

The memo auto-saves as you type and is unique per month.

---

### 4. 📋 All Events Page — Your Complete Schedule

Click the **"Your Events"** button to open the full events dashboard at `/all-events`.

- Every event you've created across all months is displayed as a **beautiful card**
- Cards show: title, date range, location, and description
- Events are sorted chronologically
- Empty state shows a friendly illustration when no events exist yet
- Cards have hover animations and a clean, premium layout

---

## 🎨 Design System

| Token | Value |
|---|---|
| **Primary Accent** | `#22c55e` (Emerald Green) |
| **Date Highlight** | `#4ade80` (Light Green) |
| **Calendar Text** | `#d1fae5` (Mint) |
| **Background** | Wall texture photograph (fixed) |
| **Heading Font** | Playfair Display (900 weight) |
| **Body Font** | Inter (400–700 weight) |
| **Border Radius** | Rounded-xl (12px) for all cards |
| **Shadow** | Layered with ambient + directional light simulation |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Animations** | [Framer Motion 11](https://www.framer.com/motion/) |
| **Date Logic** | [date-fns](https://date-fns.org/) |
| **Styling** | Vanilla CSS + CSS Modules + Tailwind CSS |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Storage** | Browser `localStorage` (no backend needed) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```
Interactive-Calendar-/
├── app/
│   ├── layout.tsx          # Root layout, fonts, viewport meta
│   ├── page.tsx            # Landing page (/) → renders LandingPage
│   ├── calendar/
│   │   └── page.tsx        # Calendar detail page (/calendar?month=X)
│   ├── all-events/
│   │   └── page.tsx        # All events dashboard (/all-events)
│   ├── globals.css         # Global base styles
│   └── client-layout.tsx   # Client-side theme provider wrapper
│
├── components/
│   ├── LandingPage.tsx     # WWF calendar landing page component
│   ├── landing.module.css  # Scoped CSS for landing page
│   ├── Calendar.tsx        # Main interactive calendar component
│   ├── CalendarGrid.tsx    # Date grid with selection logic
│   ├── EventPanel.tsx      # Event creation slide-in panel
│   └── SpiralBinding.tsx   # Decorative calendar binding UI
│
├── lib/
│   ├── calendar-utils.ts   # Date generation & range helpers
│   ├── theme-context.tsx   # Dark/Light mode context
│   └── types.ts            # TypeScript types & holiday data
│
├── public/
│   ├── forest.png          # WWF forest photography (landing slices)
│   ├── deforested.png      # Deforested background (base layer)
│   └── wall.png            # Wall texture (page background)
│
├── next.config.ts          # Next.js config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** v18 or higher → [Download](https://nodejs.org/)
- **npm** v9 or higher (comes with Node.js)

### Installation & Local Development

```bash
# 1. Clone the repository
git clone https://github.com/Redhair-Shannks/Interactive-Calendar-.git

# 2. Navigate into the project
cd Interactive-Calendar-

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> The landing page loads at `/`, click any month to go to `/calendar?month=X`

---

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server at `localhost:3000` with hot-reload |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint to check code quality |

---

### Deploy to Vercel (One Command)

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to your Vercel account
npx vercel login

# Deploy to production
npx vercel --prod --yes
```

Your app will be live in ~60 seconds at a `.vercel.app` URL.

---

## 🌐 Live Deployment

| Environment | URL |
|---|---|
| 🟢 **Production** | [wallpaper-app-jade.vercel.app](https://wallpaper-app-jade.vercel.app) |
| 📊 **Vercel Dashboard** | [vercel.com/redhair-shannks-projects/wallpaper-app](https://vercel.com/redhair-shannks-projects/wallpaper-app) |

---

## 📱 Mobile Experience

The app is fully responsive across all screen sizes:

| Screen | Behaviour |
|---|---|
| **Desktop (1280px+)** | 3 horizontal calendar slices, full-width forest panorama |
| **Tablet (768px–1280px)** | Slices scale proportionally, all features accessible |
| **Mobile (<768px)** | Slices stack vertically, each showing a cropped portion of the forest. Slogan text rotates vertically. Nav arrows move below calendar. |
| **Small phones (<380px)** | Font sizes reduce further with `clamp()`, layout remains clean |

---

## 🎯 User Journey

```
Open App
    │
    ▼
🌲 Landing Page loads
    │  Forest slides drop in (animated)
    │  Browse Q1–Q4 with arrows
    │
    ├──► Click "January" slice
    │         │
    │         ▼
    │    📅 /calendar?month=0 opens
    │         │  January calendar shown
    │         │  Festivals pre-marked
    │         │
    │         ├──► Click date → Click another date
    │         │         │
    │         │         ▼
    │         │    📝 Event panel slides in
    │         │         │  Enter: Title, Location, Description
    │         │         │  Click Save
    │         │
    │         ├──► Write Monthly Memo
    │         │         │  Auto-saved as you type
    │         │
    │         └──► Click "Your Events" button
    │                   │
    │                   ▼
    │              📋 /all-events page
    │                   │  All events as cards
    │                   │  Chronologically sorted
    │
    └──► Use ← → to navigate months within calendar
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/Interactive-Calendar-.git
cd Interactive-Calendar-
npm install
npm run dev
```

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit your changes: `git commit -m 'Add amazing feature'`
3. Push to the branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

<div align="center">

**Built with 💚 for nature lovers and productivity enthusiasts**

*WWF Interactive Calendar 2026 — Make It Green*

[⭐ Star this repo](https://github.com/Redhair-Shannks/Interactive-Calendar-) · [🐛 Report Bug](https://github.com/Redhair-Shannks/Interactive-Calendar-/issues) · [💡 Request Feature](https://github.com/Redhair-Shannks/Interactive-Calendar-/issues)

</div>
