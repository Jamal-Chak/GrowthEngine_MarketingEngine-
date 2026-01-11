# GrowthEngine

**AI-Powered Growth Platform for Modern Teams**

A production-ready SaaS application with beautiful UI, Supabase authentication, and gamified growth tracking.

## 🚀 Quick Start (5 Minutes)

**See [QUICKSTART.md](./QUICKSTART.md) for the fastest way to get running!**

## Features

✨ **Modern, Premium UI**
- Glassmorphism design
- Smooth animations with Framer Motion
- Responsive and mobile-friendly
- Dark mode optimized

🔐 **Production-Ready Authentication**
- Powered by Supabase
- Secure password hashing
- Session management
- Email verification (optional)

📊 **Growth Dashboard**
- Real-time analytics
- AI-powered recommendations
- Gamification (XP, levels, missions)
- Interactive charts

## Tech Stack

### Frontend (Next.js)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Auth**: Supabase

### Backend (Node.js)
- **Framework**: Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Prerequisites

- Node.js 18+ installed
- A free Supabase account (https://supabase.com)

## Setup

### 1. Clone and Install

```bash
# Install frontend dependencies
cd nextjs-frontend
npm install

# Install backend dependencies (optional for now)
cd ../backend
npm install
```

### 2. Configure Supabase

1. Create a free account at https://supabase.com
2. Create a new project
3. Copy your Project URL and Anon Key from Settings → API
4. Create `nextjs-frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run the App

```bash
# Frontend (required)
cd nextjs-frontend
npm run dev
```

Open http://localhost:3000 and start using the app!

## Project Structure

```
GrowthEngine/
├── nextjs-frontend/          # Next.js frontend application
│   ├── app/                  # App router pages
│   │   ├── page.tsx         # Login page
│   │   ├── register/        # Registration page
│   │   └── dashboard/       # Dashboard page
│   ├── lib/                 # Utilities
│   │   └── supabase.ts      # Supabase client
│   └── .env.local           # Environment variables
│
├── backend/                  # Express backend (optional)
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Data models
│   │   ├── services/        # Business logic
│   │   └── routes/          # API routes
│   └── package.json
│
├── QUICKSTART.md            # 5-minute setup guide
└── README.md                # This file
```

## Development

### Frontend Development
```bash
cd nextjs-frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
```

### Backend Development (Optional)
```bash
cd backend
npm run dev          # Start with nodemon
```

## Deployment

### Frontend (Vercel - Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Backend (Railway/Render)
1. Push to GitHub
2. Connect to Railway or Render
3. Add environment variables
4. Deploy!

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Features Roadmap

- [x] Authentication (Login/Register)
- [x] Modern UI with animations
- [x] Dashboard layout
- [ ] User profiles in Supabase
- [ ] Missions system
- [ ] Recommendations engine
- [ ] Team collaboration
- [ ] Analytics tracking
- [ ] Gamification (XP, badges, levels)

## Support

For issues or questions, check:
- [QUICKSTART.md](./QUICKSTART.md) - Quick setup guide
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Detailed Supabase guide

## License

MIT
