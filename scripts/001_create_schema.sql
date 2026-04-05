-- CreatorOS Database Schema
-- Run this script to set up all necessary tables
-- Note: Foreign keys to auth.users are handled by RLS policies at runtime

-- Profiles table (user_id links to Supabase auth at runtime via RLS)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'agency')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  credits_used INTEGER NOT NULL DEFAULT 0,
  credits_limit INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
DROP POLICY IF EXISTS "subscriptions_select_own" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_insert_own" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_update_own" ON public.subscriptions;
CREATE POLICY "subscriptions_select_own" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_insert_own" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_update_own" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Usage events table (for tracking credit usage)
CREATE TABLE IF NOT EXISTS public.usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('content_generation', 'trend_analysis', 'monetization_analysis', 'plan_generation')),
  credits_used INTEGER NOT NULL DEFAULT 1,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on usage_events
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;

-- Usage events policies
DROP POLICY IF EXISTS "usage_events_select_own" ON public.usage_events;
DROP POLICY IF EXISTS "usage_events_insert_own" ON public.usage_events;
CREATE POLICY "usage_events_select_own" ON public.usage_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usage_events_insert_own" ON public.usage_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Content ideas table
CREATE TABLE IF NOT EXISTS public.content_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  niche TEXT NOT NULL,
  platform TEXT NOT NULL,
  title TEXT NOT NULL,
  hook TEXT,
  script TEXT,
  caption TEXT,
  hashtags TEXT[],
  emotional_triggers TEXT[],
  virality_score NUMERIC(3, 2),
  trend_alignment NUMERIC(3, 2),
  is_saved BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on content_ideas
ALTER TABLE public.content_ideas ENABLE ROW LEVEL SECURITY;

-- Content ideas policies
DROP POLICY IF EXISTS "content_ideas_select_own" ON public.content_ideas;
DROP POLICY IF EXISTS "content_ideas_insert_own" ON public.content_ideas;
DROP POLICY IF EXISTS "content_ideas_update_own" ON public.content_ideas;
DROP POLICY IF EXISTS "content_ideas_delete_own" ON public.content_ideas;
CREATE POLICY "content_ideas_select_own" ON public.content_ideas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "content_ideas_insert_own" ON public.content_ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "content_ideas_update_own" ON public.content_ideas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "content_ideas_delete_own" ON public.content_ideas FOR DELETE USING (auth.uid() = user_id);

-- Content plans table (7-day plans)
CREATE TABLE IF NOT EXISTS public.content_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  niche TEXT NOT NULL,
  platform TEXT NOT NULL,
  plan_data JSONB NOT NULL DEFAULT '[]',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on content_plans
ALTER TABLE public.content_plans ENABLE ROW LEVEL SECURITY;

-- Content plans policies
DROP POLICY IF EXISTS "content_plans_select_own" ON public.content_plans;
DROP POLICY IF EXISTS "content_plans_insert_own" ON public.content_plans;
DROP POLICY IF EXISTS "content_plans_update_own" ON public.content_plans;
DROP POLICY IF EXISTS "content_plans_delete_own" ON public.content_plans;
CREATE POLICY "content_plans_select_own" ON public.content_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "content_plans_insert_own" ON public.content_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "content_plans_update_own" ON public.content_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "content_plans_delete_own" ON public.content_plans FOR DELETE USING (auth.uid() = user_id);

-- Monetization suggestions table
CREATE TABLE IF NOT EXISTS public.monetization_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  niche TEXT NOT NULL,
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('brand_deal', 'affiliate', 'product', 'service')),
  title TEXT NOT NULL,
  description TEXT,
  estimated_revenue NUMERIC(10, 2),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on monetization_suggestions
ALTER TABLE public.monetization_suggestions ENABLE ROW LEVEL SECURITY;

-- Monetization suggestions policies
DROP POLICY IF EXISTS "monetization_suggestions_select_own" ON public.monetization_suggestions;
DROP POLICY IF EXISTS "monetization_suggestions_insert_own" ON public.monetization_suggestions;
CREATE POLICY "monetization_suggestions_select_own" ON public.monetization_suggestions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "monetization_suggestions_insert_own" ON public.monetization_suggestions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_plans_updated_at ON public.content_plans;
CREATE TRIGGER update_content_plans_updated_at
  BEFORE UPDATE ON public.content_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
