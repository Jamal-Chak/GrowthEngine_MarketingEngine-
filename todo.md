# GrowthEngine – Practical TODO.md

This document defines **exactly** how the application should look, feel, and function in real-world terms. This is not theory. This is an execution checklist.

---

## 0. Product North Star (DO NOT SKIP)

**Target user:** Founder / Growth lead at a small–mid business

**Core promise:**

> “GrowthEngine tells you what to do next to grow — and turns it into action.”

**Primary success metric:**

* User completes first mission within 24 hours

If a feature does not support this, it is not a priority.

---

## 1. Global UX & Design Rules

### 1.1 Design System (Mandatory)

* Dark-first UI
* One primary accent color
* One success color
* One danger color
* Same border radius everywhere (rounded-xl)
* Same shadow system everywhere
* Same spacing scale (4 / 8 / 16 / 24 / 32)

**TODO**

* [ ] Create `styles/designSystem.js`
* [ ] Refactor all components to use system values
* [ ] Remove inline or custom styling inconsistencies

---

### 1.2 App-Wide UX Rules

* Every screen answers:

  1. What’s happening?
  2. What should I do?
  3. Why does it matter?

* No screen shows more than ONE primary action

* Empty states must guide the user

* No raw data without explanation

**TODO**

* [ ] Audit every page for a single clear action
* [ ] Add empty states everywhere data can be missing

---

## 2. Authentication & Access

### 2.1 Login / Register

**Behavior**

* Fast, minimal
* Clear error messages
* Remember user session

**TODO**

* [ ] Inline validation
* [ ] Friendly auth error messages
* [ ] Loading states on submit

---

## 3. Onboarding (CRITICAL)

### Goal

Get user to **first mission** in under 5 minutes.

### Flow

1. Company type
2. Primary goal
3. Team size

### Output

* Personalized dashboard
* First AI insight
* First mission auto-created

**TODO**

* [ ] Limit onboarding to 3 steps max
* [ ] Store onboarding answers
* [ ] Generate first recommendation
* [ ] Auto-create first mission

---

## 4. Dashboard (Most Important Screen)

### Dashboard Must Show

1. **Primary Insight Card**

   * Biggest growth issue right now
   * Clear language (no jargon)

2. **Primary Action**

   * Button → Start Mission

3. **Supporting Context**

   * Simple trend
   * One supporting metric

**Dashboard MUST NOT**

* Show more than 3 charts
* Overwhelm user with numbers

**TODO**

* [ ] Redesign dashboard around “Next Best Action”
* [ ] Remove non-essential widgets
* [ ] Add loading skeletons

---

## 5. AI Recommendations Engine

### Rule

AI never ends with information — it ends with action.

### Recommendation Structure

* Problem
* Why it matters
* Expected impact
* Action button → Mission

**Phase 1 (Rules-based)**

* Low activation → onboarding mission
* Drop in usage → feature discovery mission
* No engagement → reactivation mission

**TODO**

* [ ] Create Recommendation model
* [ ] Store recommendations
* [ ] Link each recommendation to a mission

---

## 6. Missions System (Action Layer)

### Mission Structure

* Title
* Why this matters
* Steps (checklist)
* Completion criteria

### Behavior

* One active mission at a time (initially)
* Clear completion feedback
* Rewards on completion

**TODO**

* [ ] Mission creation logic
* [ ] Checklist-based missions
* [ ] Completion tracking

---

## 7. Gamification (Motivation Layer)

### What to Reward

* Completing missions
* Applying recommendations
* Consistent progress

### What NOT to Reward

* Logging in
* Random clicks

**Gamification Elements**

* XP
* Levels
* Badges

**TODO**

* [ ] XP rules tied to real actions
* [ ] Visual success animations
* [ ] Progress indicators

---

## 8. Analytics (Insight Layer)

### Analytics Must Answer

> “Is this getting better or worse?”

### Rules

* Every chart has context
* Every chart ties to a recommendation

**Tracked Events**

* Page views
* Feature usage
* Mission completion
* Recommendation applied

**TODO**

* [ ] Event tracking backend
* [ ] Analytics dashboard simplification
* [ ] Insight-to-action links

---

## 9. Leaderboard & Team Features

### Purpose

* Motivation
* Visibility
* Accountability

### Behavior

* Rank by meaningful progress
* Weekly reset (optional)

**TODO**

* [ ] Role-based access
* [ ] Team progress metrics
* [ ] Leaderboard logic

---

## 10. Settings & Preferences

### Must Include

* Profile
* Team management
* Notifications
* Subscription

**TODO**

* [ ] Clear section grouping
* [ ] Save feedback on every action

---

## 11. Performance & Polish (Non-Negotiable)

* Skeleton loaders (not spinners)
* Hover & active states everywhere
* Smooth transitions
* Mobile responsiveness

**TODO**

* [ ] Add loading skeleton components
* [ ] Add micro-interactions
* [ ] Test mobile layouts

---

## 12. Monetization Readiness

### Tiers

* Free
* Pro
* Team

### Limits

* Events tracked
* AI recommendations
* Team size

**TODO**

* [ ] Subscription model
* [ ] Usage limits
* [ ] Upgrade prompts

---

## 13. Launch Readiness Checklist

* [ ] First-time user completes mission < 24h
* [ ] App explains itself without docs
* [ ] No dead ends
* [ ] No blank screens
* [ ] Clear value within 2 minutes

---

## Final Rule (Print This)

> If a feature does not reduce confusion, increase action, or improve outcomes — remove it.

This is how GrowthEngine becomes a **serious market competitor**, not just another dashboard.





# GrowthEngine – Technical TODO.md

This document defines the **practical technical structure** needed to build GrowthEngine as a scalable, production-ready SaaS. This is written for real development, not theory.

---

## 0. Technical North Star

**Goal:**
Build a scalable, modular SaaS that supports:

* AI-driven recommendations
* Event-based analytics
* Gamified action system
* Team-based B2B usage

**Core Principle:**

> Data → Insight → Action → Feedback

Every technical decision must support this loop.

---

## 1. High-Level Architecture

### Stack (Recommended)

**Frontend**

* React (Vite)
* Tailwind CSS
* Context + Hooks (state)
* React Router

**Backend**

* Node.js
* Express
* MongoDB (or PostgreSQL)
* JWT Auth

**Optional (Later)**

* Redis (caching)
* Queue (BullMQ)
* LLM API (OpenAI / Anthropic)

---

## 2. Repository Structure

```
growthengine/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── database/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── jobs/
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
│
└── docs/
```

---

## 3. Backend – Core Models (Must Exist)

### User

* id
* email
* passwordHash
* role (owner/admin/member)
* onboardingCompleted

### Organization

* id
* name
* plan
* members[]

### Event

* userId
* orgId
* type
* metadata
* timestamp

### Recommendation

* orgId
* type
* reason
* impactScore
* status

### Mission

* orgId
* recommendationId
* steps[]
* completed

### Gamification

* userId
* xp
* level
* badges[]

**TODO**

* [ ] Define schemas
* [ ] Add indexes for performance

---

## 4. Backend – Services Layer (CRITICAL)

Services contain logic. Controllers stay thin.

### Required Services

* AuthService
* EventService
* AnalyticsService
* RecommendationService
* MissionService
* GamificationService
* SubscriptionService

**TODO**

* [ ] Move all business logic into services
* [ ] Keep controllers < 50 lines

---

## 5. Event Tracking System

### Purpose

Everything in the app generates events.

### Event Examples

* USER_LOGIN
* PAGE_VIEW
* MISSION_STARTED
* MISSION_COMPLETED
* RECOMMENDATION_APPLIED

**Flow**
Frontend → API → EventService → DB

**TODO**

* [ ] Create `/events` API
* [ ] Centralize event logging

---

## 6. AI Recommendation Engine (V1 → V2)

### V1: Rules-Based Engine

Rules based on analytics:

* Low activation → onboarding mission
* Drop in engagement → reactivation mission

### V2: LLM-Enhanced

* Summarize trends
* Explain insights
* Generate mission copy

**TODO**

* [ ] RecommendationService rules
* [ ] Store recommendation history

---

## 7. Missions System (Execution Layer)

### Mission Lifecycle

1. Created (by recommendation)
2. Started
3. Completed
4. Reward issued

**TODO**

* [ ] Mission templates
* [ ] Completion validation

---

## 8. Gamification Engine

### Rules

* XP only for meaningful actions
* Level progression tied to impact

**TODO**

* [ ] XP calculation rules
* [ ] Badge triggers

---

## 9. Frontend – Application State

### Global State

* Auth
* Organization
* Active mission
* Recommendations

### Rule

No component fetches data directly if shared.

**TODO**

* [ ] Context providers
* [ ] Custom hooks per domain

---

## 10. Frontend – Data Access Layer

Create API wrappers:

* auth.api.js
* events.api.js
* analytics.api.js
* missions.api.js
* recommendations.api.js

**TODO**

* [ ] Centralize API calls
* [ ] Error handling

---

## 11. Performance & Scaling

### Must-Haves

* Pagination
* Caching
* Async jobs

**TODO**

* [ ] Redis integration
* [ ] Background jobs

---

## 12. Security & Reliability

* JWT + refresh tokens
* Rate limiting
* Input validation
* Audit logs

**TODO**

* [ ] Security middleware
* [ ] Audit trail

---

## 13. Deployment Readiness

* Env separation
* CI/CD
* Logging

**TODO**

* [ ] Dockerize services
* [ ] Production logging

---

## Final Technical Rule

> If logic is not reusable, testable, or observable — refactor it.

This structure allows GrowthEngine to scale **technically and commercially** without rewrites.
    
https://github.com/Jamal-Chak/GrowthEngine.git
