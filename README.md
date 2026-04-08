# Wall Calendar – Frontend Engineering Challenge

An interactive, polished wall calendar built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**.

## Features

- **Wall Calendar Aesthetic** – Spiral binding, hero photo (Unsplash), diagonal month/year overlay
- **Day Range Selector** – Click start date, then end date; hover preview; visual states for start, end, and in-between days
- **Notes Panel** – Monthly notes textarea, auto-saved to `localStorage`; shows selected range label
- **Responsive** – Side-by-side on desktop, stacked on mobile
- **Month Themes** – Each month has a unique accent color and matching image keyword
- **Holiday Markers** – Indian national holidays shown with dot indicators and tooltips
- **Today Highlighted** – Today's date is always visually distinct

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Design Decisions

- **No external calendar library** – pure date math with vanilla JS
- **localStorage** for persistence – no backend needed
- **Unsplash** for hero images (free, no API key)
- **Playfair Display + DM Sans** for a refined editorial feel

## Deploy

Push to GitHub, then connect to [Vercel](https://vercel.com) for instant deployment.