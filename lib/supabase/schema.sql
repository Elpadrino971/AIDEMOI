-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent', 'teacher', 'admin')),
  preferred_language TEXT DEFAULT 'fr',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Student profiles
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  grade_level TEXT NOT NULL CHECK (grade_level IN ('cp', 'ce1', 'ce2', 'cm1', 'cm2', 'sixieme', 'cinquieme', 'quatrieme', 'troisieme')),
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- Parent profiles
CREATE TABLE parent_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_language TEXT NOT NULL DEFAULT 'fr',
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- Relationship between students and parents
CREATE TABLE student_parent_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES parent_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(student_id, parent_id)
);

-- Homework questions
CREATE TABLE homework_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL CHECK (subject IN ('math', 'french', 'history', 'science', 'english', 'other')),
  grade_level TEXT NOT NULL,
  question TEXT NOT NULL,
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Homework responses (from AI)
CREATE TABLE homework_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES homework_questions(id) ON DELETE CASCADE,
  original_response TEXT NOT NULL,
  hints TEXT[] DEFAULT '{}',
  explanations TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(question_id)
);

-- Translations cache
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id UUID NOT NULL REFERENCES homework_responses(id) ON DELETE CASCADE,
  target_language TEXT NOT NULL,
  translated_response TEXT NOT NULL,
  translated_hints TEXT[] DEFAULT '{}',
  translated_explanations TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(response_id, target_language)
);

-- Usage quotas
CREATE TABLE usage_quotas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  questions_asked INTEGER DEFAULT 0,
  daily_limit INTEGER DEFAULT 5,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'school')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, date)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'premium', 'school')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes for performance
CREATE INDEX idx_homework_questions_student ON homework_questions(student_id);
CREATE INDEX idx_homework_questions_created ON homework_questions(created_at DESC);
CREATE INDEX idx_homework_responses_question ON homework_responses(question_id);
CREATE INDEX idx_translations_response ON translations(response_id);
CREATE INDEX idx_usage_quotas_user_date ON usage_quotas(user_id, date);
CREATE INDEX idx_student_parent_links_student ON student_parent_links(student_id);
CREATE INDEX idx_student_parent_links_parent ON student_parent_links(parent_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_parent_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Student profiles policies
CREATE POLICY "Students can view own profile" ON student_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Parents can view linked students" ON student_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_parent_links spl
      JOIN parent_profiles pp ON pp.id = spl.parent_id
      WHERE spl.student_id = student_profiles.id
      AND pp.user_id = auth.uid()
    )
  );

-- Homework questions policies
CREATE POLICY "Students can view own questions" ON homework_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_profiles sp
      WHERE sp.id = homework_questions.student_id
      AND sp.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can create own questions" ON homework_questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_profiles sp
      WHERE sp.id = homework_questions.student_id
      AND sp.user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view linked students questions" ON homework_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_parent_links spl
      JOIN parent_profiles pp ON pp.id = spl.parent_id
      WHERE spl.student_id = homework_questions.student_id
      AND pp.user_id = auth.uid()
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION increment_usage_quota(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO usage_quotas (user_id, date, questions_asked, daily_limit)
  VALUES (p_user_id, CURRENT_DATE, 1, 5)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    questions_asked = usage_quotas.questions_asked + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_usage_quota(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_questions_asked INTEGER;
  v_daily_limit INTEGER;
BEGIN
  SELECT questions_asked, daily_limit
  INTO v_questions_asked, v_daily_limit
  FROM usage_quotas
  WHERE user_id = p_user_id AND date = CURRENT_DATE;

  IF NOT FOUND THEN
    RETURN TRUE;
  END IF;

  RETURN v_questions_asked < v_daily_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
