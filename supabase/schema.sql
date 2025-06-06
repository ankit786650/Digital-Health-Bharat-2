
-- Enable a helper function for trigger-based updated_at columns
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Profiles table (to extend Supabase auth.users)
-- Stores additional user-specific information not covered by Supabase Auth.
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT, -- e.g., 'male', 'female', 'other', 'prefer_not_to_say'
  primary_phone TEXT,
  secondary_phone TEXT,
  primary_email TEXT, -- Can be synced or different from auth.users.email
  secondary_email TEXT,
  home_address TEXT,
  emergency_contact1_name TEXT,
  emergency_contact1_phone TEXT,
  emergency_contact2_name TEXT,
  emergency_contact2_phone TEXT,
  preferred_language TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  blood_type TEXT, -- e.g., 'a_pos', 'o_neg'
  chronic_conditions TEXT -- Could be a comma-separated list or JSONB for more structure
);
-- Trigger for profiles updated_at
CREATE TRIGGER on_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Medication Reminders table
-- Stores all medication reminders, whether manually added or AI-generated.
CREATE TABLE public.medication_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  timings TEXT NOT NULL, -- General frequency, e.g., "Once a day"
  dosage_form TEXT, -- e.g., 'tablet', 'capsule', 'syrup'
  specific_times JSONB, -- Array of HH:mm strings, e.g., ["08:00", "20:00"]
  start_date DATE,
  duration_value INT,
  duration_unit TEXT, -- e.g., 'days', 'weeks', 'months', 'no_end_date'
  instructions TEXT,
  refill_reminder_enabled BOOLEAN DEFAULT FALSE,
  refill_days_before_empty INT,
  medication_shape TEXT, -- e.g., 'round', 'oval'
  is_generated_by_ai BOOLEAN DEFAULT FALSE,
  source_prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL -- Optional link if generated from a specific prescription
);
-- Trigger for medication_reminders updated_at
CREATE TRIGGER on_medication_reminders_updated_at
BEFORE UPDATE ON public.medication_reminders
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Doctor Visits table
-- Stores records of doctor visits and appointments.
CREATE TABLE public.doctor_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  visit_date DATE NOT NULL,
  doctor_name TEXT NOT NULL,
  specialization TEXT,
  reason_for_visit TEXT,
  notes TEXT, -- Clinical notes or summary
  next_appointment_time TIME, -- For a quick reminder, not a full scheduling system
  next_appointment_note TEXT
);
-- Trigger for doctor_visits updated_at
CREATE TRIGGER on_doctor_visits_updated_at
BEFORE UPDATE ON public.doctor_visits
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Prescriptions table (specifically for uploaded prescription files that might be OCR'd)
-- Stores metadata about uploaded prescription files.
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES public.doctor_visits(id) ON DELETE SET NULL, -- Optional: link prescription to a visit
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  document_title TEXT, -- e.g., "Prescription from Dr. Smith - 2024-07-30"
  file_name TEXT, -- Original file name
  storage_path TEXT NOT NULL, -- Path in Supabase Storage, e.g., user_id/prescriptions/file_name.pdf
  ocr_extracted_text TEXT -- Optional: if raw OCR text is stored
);
-- Note: medication_reminders can link here via source_prescription_id if AI generated

-- Medical Documents table
-- Stores various medical documents like lab reports, imaging results, etc.
CREATE TABLE public.medical_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES public.doctor_visits(id) ON DELETE SET NULL, -- Optional: link document to a visit
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  document_title TEXT NOT NULL,
  document_type TEXT NOT NULL, -- e.g., 'Lab Report', 'Imaging', 'Insurance Card', 'Vaccination Record'
  document_date DATE, -- Date on the document itself
  doctor_name TEXT, -- Doctor associated with the document, if any
  visit_reason TEXT, -- Reason for visit if document is tied to one
  file_name TEXT, -- Original file name
  storage_path TEXT NOT NULL -- Path in Supabase Storage, e.g., user_id/documents/file_name.pdf
);

-- Enable Row Level Security (RLS) for all tables
-- Policies should be created to allow users to access only their own data.
-- Example for one table (apply similar policies to others, adjusting user_id column name as needed):
--
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view and manage their own profile."
--   ON public.profiles FOR ALL
--   USING (auth.uid() = id)
--   WITH CHECK (auth.uid() = id);
--
-- ALTER TABLE public.medication_reminders ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view and manage their own medication reminders."
--   ON public.medication_reminders FOR ALL
--   USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id);
--
-- ALTER TABLE public.doctor_visits ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view and manage their own doctor visits."
--   ON public.doctor_visits FOR ALL
--   USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id);
--
-- ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view and manage their own prescriptions."
--   ON public.prescriptions FOR ALL
--   USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id);
--
-- ALTER TABLE public.medical_documents ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view and manage their own medical documents."
--   ON public.medical_documents FOR ALL
--   USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id);

-- Note on Supabase Storage:
-- You'll also need to set up Supabase Storage buckets (e.g., 'prescriptions', 'medical_documents')
-- and define appropriate storage policies to control access to uploaded files, typically ensuring
-- users can only access their own files.
-- Example storage policy for a bucket named 'user_documents':
-- ((bucket_id = 'user_documents'::text) AND ((uid())::text = (storage.foldername(name))[1]))
-- This assumes files are stored in folders named after the user's ID.

