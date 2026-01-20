# GrowthEngine - Project Documentation

## 🚀 Overview
GrowthEngine is a high-performance marketing engine designed to transform business data into actionable growth strategies. It combines AI-driven insights with a gamified execution layer to make business growth both scientific and engaging.

## 🛠 Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion (Animations).
- **Backend / Database**: Supabase (PostgreSQL, Auth, RLS).
- **Utilities**: Lucide React (Icons), Recharts (Analytics), KBar (Command Palette), Canvas-Confetti (Celebrate success).

## 🏗 Architecture

### 1. Unified Design System
The app uses a premium **Glassmorphism** aesthetic.
- **`globals.css`**: Defines the foundational tokens, radial gradients, and "glass" effect variables.
- **Dynamic Gradients**: Backgrounds use animated mesh gradients for a state-of-the-art feel.

### 2. The AI Engine (`lib/services/ai-service.ts`)
The "Engine" part of the application. It aggregates user events and generates structured recommendations.
- **Status**: Currently uses a high-fidelity template engine ready for LLM (OpenAI/Claude) integration.
- **Persistence**: Every generated insight is saved to the `recommendations` table in Supabase.

### 3. Gamification Framework (`lib/services/events.ts`)
Turns business growth into a "game".
- **Events**: Page views, mission starts, and strategy generations are tracked.
- **XP / Levels**: Every action awards XP. A Postgres function (`award_xp`) calculates levels (1000 XP per level) and logs the history.
- **Visuals**: Confetti triggers on successful strategy generation or level-up.

### 4. Interactive Command Palette (`Ctrl+K`)
A premium productivity feature that allows instant navigation between:
- Dashboard
- Missions
- Settings
- Profile management

## 📂 Project Structure
```
growthengine/
├── nextjs-frontend/         # Main Application
│   ├── app/                 # Next.js App Router (Layouts, Pages)
│   ├── components//         # Reusable UI (Sidebar, CommandPalette, etc.)
│   ├── lib/                 # Core logic, API wrappers, and Services
│   │   ├── services/        # AI and Event engines
│   │   └── utils/           # Visual utilities (Confetti)
│   └── public/              # Static assets
├── supabase_schema.sql      # Core Database Structure
└── supabase_extended_schema.sql # AI & Gamification Extensions
```

## ⚙️ Setup & Deployment

1.  **Environment Variables**: Ensure `.env.local` contains your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2.  **Database Initialisation**:
    - Run `supabase_schema.sql` first.
    - Run `supabase_extended_schema.sql` to enable the "Engine" features.
3.  **Local Development**:
    ```bash
    npm install
    npm run dev
    ```

## 📈 Future Roadmap
- [ ] Connect `ai-service` to OpenAI's GPT-4 API.
- [ ] Implement multi-tenant "Organizations" for B2B teams.
- [ ] Add real-time "Social Proof" notifications of team growth.
