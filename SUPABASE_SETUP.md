# Supabase Setup Guide for GrowthEngine

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (or create an account)
4. Click "New Project"
5. Fill in:
   - **Name**: GrowthEngine
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to you
6. Click "Create new project" (takes ~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, click on the **Settings** icon (gear) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (long string)

## Step 3: Configure Your App

1. Open the file: `nextjs-frontend/.env.local`
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Set Up Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. **Email** provider should be enabled by default
3. Scroll down to **Email Auth** settings:
   - **Enable email confirmations**: You can disable this for development (faster testing)
   - Click **Save**

## Step 5: Restart the App

After adding your Supabase credentials:

1. Stop the Next.js server (Ctrl+C in terminal)
2. Run `npm run dev` again in the `nextjs-frontend` folder
3. The app will now use Supabase for authentication!

## Testing

1. Go to `http://localhost:3000`
2. Click "Create one now" to register
3. Fill in your details and submit
4. You should be redirected to the dashboard!

## Viewing Users in Supabase

1. Go to **Authentication** → **Users** in Supabase dashboard
2. You'll see all registered users here
3. You can manually verify emails, delete users, etc.

## Optional: Disable Email Confirmation (for faster development)

1. In Supabase dashboard: **Authentication** → **Providers**
2. Scroll to **Email**
3. Toggle OFF "Enable email confirmations"
4. Click **Save**

Now users can sign up and log in immediately without email verification!

---

## What's Next?

Once authentication is working, we can:
- Add user profiles to Supabase database
- Store missions, recommendations, and gamification data
- Build out the full dashboard with real data
