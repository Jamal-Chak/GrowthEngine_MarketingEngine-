# 🚀 Quick Start Guide - Get GrowthEngine Running in 5 Minutes

## What You Need (2 minutes)

1. **Create a FREE Supabase account**: https://supabase.com
2. **Create a new project** (name it "GrowthEngine")
3. **Copy 2 values** from your project settings:
   - Project URL
   - Anon/Public Key

## Setup Steps

### Step 1: Add Your Supabase Credentials (1 minute)

Open this file: `nextjs-frontend/.env.local`

Replace with your actual values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

**Where to find these:**
- In Supabase dashboard → Settings (gear icon) → API
- Copy "Project URL" and "anon public" key

### Step 2: Disable Email Confirmation (Optional - for faster testing)

In Supabase dashboard:
1. Go to **Authentication** → **Providers**
2. Click on **Email**
3. Turn OFF "Confirm email"
4. Click **Save**

This lets you test login/register immediately without checking email!

### Step 3: Run the App (1 minute)

```bash
# In terminal 1 - Backend (optional, for future features)
cd backend
npm run dev

# In terminal 2 - Frontend
cd nextjs-frontend
npm run dev
```

### Step 4: Test It! (1 minute)

1. Open http://localhost:3000
2. Click "Create one now"
3. Register with any email/password
4. You're in! 🎉

## That's It!

✅ **Production-ready authentication** (Supabase handles security, password hashing, sessions)
✅ **Beautiful modern UI** (glassmorphism, animations, responsive)
✅ **Works immediately** (no database setup needed)

## View Your Users

Go to Supabase dashboard → Authentication → Users to see all registered users!

---

## Troubleshooting

**Problem**: "Invalid API key" error
**Solution**: Double-check you copied the ANON key (not the service_role key)

**Problem**: "Email not confirmed" error  
**Solution**: Disable email confirmation in Supabase (see Step 2 above)

**Problem**: App won't load
**Solution**: Make sure you saved the `.env.local` file and restarted the dev server

---

## What's Next?

Once authentication works, we can add:
- Real database tables for missions, recommendations, XP
- Team collaboration features
- Analytics dashboard with real data
- AI-powered recommendations

But first, let's get you logged in! 🚀
