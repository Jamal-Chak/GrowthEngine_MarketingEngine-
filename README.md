# GrowthEngine - AI-Powered Marketing Platform

GrowthEngine is a comprehensive, gamified marketing growth platform that helps businesses turn their analytics data into actionable revenue-generating missions. It features AI-driven recommendations, team leaderboards, and a complete mission management system.

![GrowthEngine Banner](https://via.placeholder.com/1200x400?text=GrowthEngine+Platform)

## 🚀 Features

*   **AI-Powered Missions:** Get 3 high-impact tasks weekly based on your specific metrics.
*   **Gamification:** Earn XP, level up, and unlock badges for completing growth tasks.
*   **Team Leaderboards:** Compete with team members to drive engagement.
*   **Analytics Dashboard:** Visualize trends and measure the impact of your actions.
*   **Monetization:** Integrated subscription system with Flutterwave payments.
*   **Secure Authentication:** Custom JWT-based auth with rate limiting and security headers.

## 🛠️ Tech Stack

*   **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion
*   **Backend:** Node.js, Express, MongoDB, JWT
*   **Payments:** Flutterwave API
*   **Deployment:** Vercel (Frontend) + Railway (Backend)

## 🏁 Getting Started

### Prerequisites

*   Node.js v18+
*   MongoDB Atlas Account
*   Flutterwave Account (Test keys)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/growthengine.git
    cd growthengine
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    cp .env.example .env # Fill in your MONGO_URI and JWT_SECRET
    npm run dev
    ```

3.  **Setup Frontend**
    ```bash
    cd ../nextjs-frontend
    npm install
    # Create .env.local with: NEXT_PUBLIC_API_URL=http://localhost:5000
    npm run dev
    ```

4.  **Visit App**
    Open [http://localhost:3000](http://localhost:3000)

## 🌍 Deployment

### Backend (Railway/Render)
1.  Connect your repo.
2.  Set Root Directory to `backend`.
3.  Add Environment Variables: `MONGO_URI`, `JWT_SECRET`, `FLW_PUBLIC_KEY`, `FLW_SECRET_KEY`.
4.  Deploy.

### Frontend (Vercel)
1.  Connect your repo.
2.  Set Root Directory to `nextjs-frontend`.
3.  Add Environment Variable: `NEXT_PUBLIC_API_URL` (Your Railway backend URL).
4.  Deploy.

## 📁 Project Structure

*   `/backend`: Node.js/Express API
    *   `/src/controllers`: Request handlers
    *   `/src/models`: Mongoose schemas
    *   `/src/routes`: API endpoints
    *   `/src/services`: Business logic (Payment, AI, Subscription)
*   `/nextjs-frontend`: Next.js App Router
    *   `/app`: Pages and Layouts
    *   `/components`: Reusable UI components
    *   `/context`: Global state (Auth)
    *   `/lib`: Utilities and helpers

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
