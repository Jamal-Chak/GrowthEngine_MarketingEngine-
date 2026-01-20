# GrowthEngine – Product Improvement & Feature Expansion TODO

## 🎯 CORE GOAL
Turn GrowthEngine into a **decision + execution engine** that:
- Tells users *what to do next*
- Measures real business impact
- Builds habits through meaningful gamification

---

## ✅ PHASE 1: FOUNDATION HARDENING (HIGH PRIORITY)

### 1. Product Positioning & UX
- [ ] Rewrite homepage value proposition (outcomes > features)
- [ ] Add “What happens in your first 10 minutes” section
- [ ] Define 1 primary user persona (Founder / Marketer / Agency)
- [ ] Remove any UI elements that do not support decision-making

### 2. Onboarding Flow (Critical)
- [ ] Step 1: Select business type (SaaS, Ecommerce, Service)
- [ ] Step 2: Select growth goal (Revenue, Leads, Retention)
- [ ] Step 3: Connect at least one data source (manual allowed)
- [ ] Step 4: Generate first AI mission (confetti only here)

### 3. Data Model Improvements
- [ ] Separate tables:
  - events (raw user/system actions)
  - insights (AI interpretations)
  - missions (actionable tasks)
- [ ] Add mission_status (pending, active, completed, failed)
- [ ] Add mission_priority (low, medium, high)
- [ ] Add mission_due_date
- [ ] Add mission_owner (user/team)

---

## 🧠 PHASE 2: AI ENGINE UPGRADE (CORE DIFFERENTIATOR)

### 4. AI Recommendation Structure
- [ ] Enforce structured output:
  - Why this matters
  - Exact action
  - Expected impact
  - Effort level
  - Time estimate
- [ ] Add confidence score per recommendation
- [ ] Store AI reasoning (hidden from UI, used for audits)

### 5. Mission Generator
- [ ] Convert AI insights into executable missions
- [ ] Allow users to accept, reject, or snooze missions
- [ ] Track mission completion rate
- [ ] Penalize XP for ignored missions (lightly)

### 6. Feedback Loop
- [ ] After mission completion, ask:
  - Did this help? (Yes / No)
  - Manual impact input (optional)
- [ ] Feed results back into AI engine
- [ ] Improve future recommendations per user

---

## 🧪 PHASE 3: EXPERIMENTATION & SCIENCE LAYER

### 7. Experiments System (Huge Value Add)
- [ ] Create experiments table:
  - hypothesis
  - metric
  - duration
  - expected outcome
- [ ] Link missions to experiments
- [ ] Auto-evaluate results after duration
- [ ] Show “Experiment Success Rate” on dashboard

### 8. Growth Score
- [ ] Calculate Growth Score based on:
  - Mission completion
  - Experiment success
  - Metric improvement
- [ ] Display trend (up/down)
- [ ] Use score to unlock features

---

## 🎮 PHASE 4: MEANINGFUL GAMIFICATION

### 9. XP & Levels Rework
- [ ] Tie XP to:
  - Completed missions
  - Successful experiments
  - Consistency streaks
- [ ] Reduce XP for passive actions (page views)
- [ ] Add streak bonuses (daily/weekly execution)

### 10. Unlocks (Not Cosmetic)
- [ ] Level 3: Deeper AI recommendations
- [ ] Level 5: Experiments & hypotheses
- [ ] Level 7: Team features
- [ ] Level 10: Advanced analytics

---

## 🏢 PHASE 5: B2B & TEAM FEATURES

### 11. Organizations & Roles
- [ ] Add organizations table
- [ ] Role types:
  - Owner
  - Manager
  - Contributor
- [ ] Permission-based mission assignment
- [ ] Org-level Growth Score

### 12. Team Execution Dashboard
- [ ] Show who is working on what
- [ ] Blockers indicator
- [ ] Mission overdue alerts
- [ ] Weekly execution summary

---

## 📊 PHASE 6: ANALYTICS & INTEGRATIONS

### 13. Core Integrations (Start Simple)
- [ ] Google Analytics (traffic & conversion)
- [ ] Stripe (revenue events)
- [ ] Manual CSV upload fallback

### 14. Impact Tracking
- [ ] Before vs After metrics per mission
- [ ] Revenue / conversion deltas
- [ ] Visual timeline of improvements

---

## 🧱 PHASE 7: POLISH & TRUST

### 15. UI/UX Refinement
- [ ] Reduce glass effects on data-heavy screens
- [ ] Improve readability for dashboards
- [ ] Add “Focus Mode” (distraction-free execution view)

### 16. Trust & Professionalism
- [ ] Audit log for all AI decisions
- [ ] Explainability panel (“Why the AI suggested this”)
- [ ] Exportable reports (PDF / shareable link)

---

## 🚀 PHASE 8: MONETIZATION & SCALE

### 17. Pricing Gates
- [ ] Free: Limited missions/month
- [ ] Pro: Full AI + experiments
- [ ] Team: Organizations & analytics
- [ ] Enterprise: Custom models + support

### 18. Performance & Scaling
- [ ] Cache AI responses
- [ ] Background jobs for heavy analysis
- [ ] Rate limit AI calls per plan

---

## ❌ FEATURES TO AVOID (FOR NOW)
- ❌ Social feeds
- ❌ Generic CRM features
- ❌ Too many integrations early
- ❌ Cosmetic badges without meaning

---

## 🧭 SUCCESS METRICS
- Daily mission completion rate
- Time to first successful mission
- Experiment success %
- Retention after 14 days
- Revenue impact per user

---

## 🏁 END GOAL
GrowthEngine should feel like:
> “A senior growth strategist sitting next to you, making sure you execute.”

Straight coaching notes

Error: Failed to run sql query: ERROR: 42P07: relation "missions" already exists