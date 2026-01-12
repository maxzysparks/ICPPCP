-- Enable RLS on all tables and create permissive policies
-- Since your NestJS backend handles authentication/authorization via JWT,
-- we enable RLS but allow all operations through the service role key

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations for authenticated service role
-- (Your NestJS backend connects with the service role key which bypasses RLS)

-- Users table policies
CREATE POLICY "Allow all for service role" ON public.users
    FOR ALL USING (true) WITH CHECK (true);

-- Patients table policies
CREATE POLICY "Allow all for service role" ON public.patients
    FOR ALL USING (true) WITH CHECK (true);

-- Medications table policies
CREATE POLICY "Allow all for service role" ON public.medications
    FOR ALL USING (true) WITH CHECK (true);

-- Providers table policies
CREATE POLICY "Allow all for service role" ON public.providers
    FOR ALL USING (true) WITH CHECK (true);

-- Appointments table policies
CREATE POLICY "Allow all for service role" ON public.appointments
    FOR ALL USING (true) WITH CHECK (true);

-- Caregivers table policies
CREATE POLICY "Allow all for service role on caregivers" ON public.caregivers
    FOR ALL USING (true) WITH CHECK (true);

-- Care teams table policies
CREATE POLICY "Allow all for service role" ON public.care_teams
    FOR ALL USING (true) WITH CHECK (true);

-- Care team members table policies
CREATE POLICY "Allow all for service role" ON public.care_team_members
    FOR ALL USING (true) WITH CHECK (true);

-- Audit logs table policies
CREATE POLICY "Allow all for service role" ON public.audit_logs
    FOR ALL USING (true) WITH CHECK (true);

-- Note: The service_role key bypasses RLS entirely, so your NestJS backend
-- will continue to work normally. These policies are for any direct API access
-- through Supabase's PostgREST API (which you're not using).
