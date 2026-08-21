-- ============================================================================
-- MeetSmart AI - Supabase Schema & Seed Data
-- ============================================================================
-- Description:
--   This file contains the complete SQL script to set up the relational tables
--   for MeetSmart AI and populate them with a comprehensive dummy dataset.
--
-- How to run this in Supabase:
--   1. Open your Supabase Dashboard (https://supabase.com).
--   2. Go to the SQL Editor from the sidebar.
--   3. Create a new query, paste the contents of this file, and click 'Run'.
-- ============================================================================

-- Clean up existing objects if they exist
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS meeting_attendees CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS employees CASCADE;

DROP TYPE IF EXISTS employee_status CASCADE;
DROP TYPE IF EXISTS room_status CASCADE;
DROP TYPE IF EXISTS meeting_status CASCADE;
DROP TYPE IF EXISTS priority_level CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Enums
CREATE TYPE employee_status AS ENUM ('active', 'away', 'offline');
CREATE TYPE room_status AS ENUM ('available', 'occupied', 'maintenance');
CREATE TYPE meeting_status AS ENUM ('upcoming', 'completed', 'cancelled');
CREATE TYPE priority_level AS ENUM ('high', 'medium', 'low');
CREATE TYPE task_status AS ENUM ('todo', 'in-progress', 'done');

-- ----------------------------------------------------------------------------
-- 1. Employees Table (At least 10 users)
-- ----------------------------------------------------------------------------
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    status employee_status DEFAULT 'offline'::employee_status NOT NULL,
    avatar_color VARCHAR(50) NOT NULL,
    meetings_this_week INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for email searches and department filters
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_department ON employees(department);

-- Insert Employees (13 records - exceeds requirement of 10 users)
INSERT INTO employees (id, name, role, email, department, status, avatar_color, meetings_this_week) VALUES
('c10a11a2-3f1a-4d7a-8b1e-2e2a22222221', 'Sarah Chen', 'Product Manager', 'sarah.c@meetsmart.io', 'Product', 'active', 'bg-blue-500', 12),
('c10a11a2-3f1a-4d7a-8b1e-2e2a22222222', 'Marcus Reed', 'Senior Engineer', 'marcus.r@meetsmart.io', 'Engineering', 'active', 'bg-emerald-500', 8),
('c10a11a2-3f1a-4d7a-8b1e-2e2a22222223', 'Priya Nair', 'UX Designer', 'priya.n@meetsmart.io', 'Design', 'away', 'bg-amber-500', 6),
('c10a11a2-3f1a-4d7a-8b1e-2e2a22222224', 'David Okoye', 'Engineering Lead', 'david.o@meetsmart.io', 'Engineering', 'active', 'bg-rose-500', 15),
('c10a11a2-3f1a-4d7a-8b1e-2e2a22222225', 'Elena Rossi', 'Marketing Manager', 'elena.r@meetsmart.io', 'Marketing', 'offline', 'bg-violet-500', 4),
('c10a11a2-3f1a-4d7a-8b1e-2e2a22222226', 'Tom Walsh', 'Sales Director', 'tom.w@meetsmart.io', 'Sales', 'active', 'bg-cyan-500', 18),
('c10a11a2-3f1a-4d7a-8b1e-2e2a22222227', 'Aisha Khan', 'Data Analyst', 'aisha.k@meetsmart.io', 'Data', 'away', 'bg-teal-500', 7),
('c10a11a2-3f1a-4d7a-8b1e-2e2a22222228', 'Carlos Mendez', 'Operations', 'carlos.m@meetsmart.io', 'Operations', 'active', 'bg-orange-500', 10),
('c10a11a2-3f1a-4d7a-8b1e-2e2a22222229', 'John Doe', 'HR Associate', 'john.d@meetsmart.io', 'HR', 'active', 'bg-indigo-500', 2),
('c10a11a2-3f1a-4d7a-8b1e-2e2a22222230', 'Jane Smith', 'Finance Manager', 'jane.s@meetsmart.io', 'Finance', 'active', 'bg-pink-500', 5),
-- Edge Case: User with 0 meetings this week and offline status
('c10a11a2-3f1a-4d7a-8b1e-2e2a22222231', 'Linus Torvalds', 'Kernel Architect', 'linus.t@meetsmart.io', 'Systems', 'offline', 'bg-slate-500', 0),
-- Edge Case: User with high meetings (meetings load)
('c10a11a2-3f1a-4d7a-8b1e-2e2a22222232', 'Beatrice Vance', 'Executive Assistant', 'beatrice.v@meetsmart.io', 'Executive', 'active', 'bg-purple-500', 25),
-- Edge Case: User in legal department with empty/away status
('c10a11a2-3f1a-4d7a-8b1e-2e2a22222233', 'Robert Draper', 'Legal Counsel', 'robert.d@meetsmart.io', 'Legal', 'away', 'bg-emerald-500', 3);

-- ----------------------------------------------------------------------------
-- 2. Rooms Table (At least 10 records)
-- ----------------------------------------------------------------------------
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    floor VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    amenities TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    status room_status DEFAULT 'available'::room_status NOT NULL,
    utilization INTEGER DEFAULT 0 NOT NULL CHECK (utilization >= 0 AND utilization <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Rooms (10 records)
INSERT INTO rooms (id, name, floor, capacity, amenities, status, utilization) VALUES
('b20b22b3-4f2b-5d8b-9c2f-3f3b33333331', 'Boardroom A', 'Floor 1', 16, ARRAY['4K Display', 'Video Conferencing', 'Whiteboard'], 'occupied', 95),
('b20b22b3-4f2b-5d8b-9c2f-3f3b33333332', 'Huddle 1', 'Floor 1', 6, ARRAY['TV Display', 'Whiteboard'], 'available', 40),
('b20b22b3-4f2b-5d8b-9c2f-3f3b33333333', 'Huddle 2', 'Floor 1', 6, ARRAY['TV Display'], 'available', 20),
('b20b22b3-4f2b-5d8b-9c2f-3f3b33333334', 'Innovation Lab', 'Floor 2', 12, ARRAY['Smart Board', 'Video Conferencing', 'VR Kit'], 'maintenance', 0),
('b20b22b3-4f2b-5d8b-9c2f-3f3b33333335', 'Executive Suite', 'Floor 2', 8, ARRAY['4K Display', 'Video Conferencing'], 'available', 60),
('b20b22b3-4f2b-5d8b-9c2f-3f3b33333336', 'Training Room', 'Floor 2', 30, ARRAY['Projector', 'Microphone System', 'Whiteboard'], 'occupied', 88),
('b20b22b3-4f2b-5d8b-9c2f-3f3b33333337', 'Focus Pod A', 'Floor 1', 2, ARRAY['TV Display', 'Whiteboard'], 'available', 15),
-- Edge Case: Available room with 0% utilization
('b20b22b3-4f2b-5d8b-9c2f-3f3b33333338', 'Focus Pod B', 'Floor 1', 2, ARRAY['Acoustic Paneling'], 'available', 0),
-- Edge Case: High capacity room in maintenance
('b20b22b3-4f2b-5d8b-9c2f-3f3b33333339', 'Presentation Hall', 'Floor 3', 100, ARRAY['Stage', 'Double Projector', 'Surround Sound'], 'maintenance', 0),
('b20b22b3-4f2b-5d8b-9c2f-3f3b33333340', 'Project Room X', 'Floor 3', 10, ARRAY['TV Display', 'Whiteboard', 'Webcam'], 'occupied', 75);

-- ----------------------------------------------------------------------------
-- 3. Meetings Table (At least 20 records - main application entity)
-- ----------------------------------------------------------------------------
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(20) NOT NULL,
    duration VARCHAR(10) NOT NULL,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    organizer_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    status meeting_status DEFAULT 'upcoming'::meeting_status NOT NULL,
    priority priority_level DEFAULT 'medium'::priority_level NOT NULL,
    agenda TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for dates and status filters
CREATE INDEX idx_meetings_date ON meetings(date);
CREATE INDEX idx_meetings_status ON meetings(status);

-- Insert Meetings (23 records - exceeds requirement of 20 meetings)
-- Note: Date formats are actual DATE types. In frontend, they will be formatted as "Month Day" (e.g. Aug 21).
-- The dates fall in August 2026 to align with the frontend calendar current month.
INSERT INTO meetings (id, title, date, time, duration, room_id, organizer_id, status, priority, agenda) VALUES
-- Main meetings matching existing data
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444401', 'Q3 Product Roadmap Review', '2026-08-21', '10:00 AM', '45m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333331', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221', 'upcoming', 'high', ARRAY['Review Q2 outcomes', 'Align on Q3 priorities', 'Resource allocation']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444402', 'Engineering Sprint Planning', '2026-08-21', '1:00 PM', '60m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333334', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222224', 'upcoming', 'high', ARRAY['Sprint goal', 'Story pointing', 'Capacity planning']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444403', 'Design System Sync', '2026-08-22', '11:00 AM', '30m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333332', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222223', 'upcoming', 'medium', ARRAY['Component audit', 'Token migration']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444404', 'Weekly Marketing Standup', '2026-08-22', '9:30 AM', '15m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333333', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222225', 'upcoming', 'low', ARRAY['Campaign updates', 'Metrics review']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444405', 'Customer Success Review', '2026-08-19', '2:00 PM', '50m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333335', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222226', 'completed', 'medium', ARRAY['Renewal pipeline', 'Churn risks']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444406', 'All-Hands Townhall', '2026-08-23', '4:00 PM', '60m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333336', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221', 'upcoming', 'high', ARRAY['Company updates', 'OKR progress', 'Q&A']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444407', 'Data Pipeline Architecture', '2026-08-20', '3:00 PM', '45m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333334', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222227', 'completed', 'medium', ARRAY['Schema review', 'ETL design']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444408', 'Vendor Negotiation', '2026-08-24', '10:30 AM', '40m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333335', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222228', 'upcoming', 'high', ARRAY['Pricing terms', 'Contract length']),

-- Expanded meetings (older, recent, and new topics)
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444409', 'Budget Allocation Review', '2026-08-18', '11:30 AM', '60m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333331', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222230', 'completed', 'high', ARRAY['Review dept requests', 'Approve Q3 budget']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444410', 'HR Policy Update', '2026-08-21', '3:00 PM', '30m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333336', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222229', 'upcoming', 'low', ARRAY['Remote work revisions', 'Leave policies']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444411', 'Security Audit Prep', '2026-08-20', '10:00 AM', '90m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333337', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222222', 'completed', 'high', ARRAY['Review server log controls', 'Penetration test parameters']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444412', 'UI Polish & QA Session', '2026-08-22', '2:00 PM', '45m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333332', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222223', 'upcoming', 'medium', ARRAY['Review dashboard alignments', 'Test mobile layout responsive breakpoints']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444413', 'Project Kickoff - Orion', '2026-08-15', '9:00 AM', '60m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333331', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221', 'completed', 'high', ARRAY['Scope details', 'Milestone dates', 'Assign core responsibilities']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444414', 'One-on-One: Sarah & Marcus', '2026-08-21', '9:00 AM', '30m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333333', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221', 'completed', 'medium', ARRAY['Review engineering career goals', 'Project blockers check-in']),
-- Edge Case: Long duration meeting
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444415', 'Brainstorming: Next-Gen AI features', '2026-08-25', '11:00 AM', '120m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333334', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222224', 'upcoming', 'high', ARRAY['Discuss NLP frameworks', 'Brainstorm agentic capabilities', 'Whiteboarding user journeys']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444416', 'Content Strategy Planning', '2026-08-12', '10:00 AM', '60m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333332', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222225', 'completed', 'low', ARRAY['Newsletter structure', 'Blog post schedule']),
-- Edge Case: Cancelled meeting
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444417', 'Emergency Bug Triage', '2026-08-21', '11:30 AM', '30m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333338', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222222', 'cancelled', 'high', ARRAY['Identify memory leak root cause', 'Review server core dump logs']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444418', 'Sales Pitch Training', '2026-08-26', '9:00 AM', '60m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333336', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222226', 'upcoming', 'medium', ARRAY['Review objection handling', 'Roleplay scenarios']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444419', 'Annual General Meeting', '2026-08-10', '2:00 PM', '180m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333336', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222228', 'completed', 'high', ARRAY['Executive updates', 'FY26 fiscal year wrap-up', 'Board elections']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444420', 'Legal Document Review', '2026-08-21', '4:00 PM', '45m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333335', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222233', 'upcoming', 'medium', ARRAY['Review vendor agreements', 'Nondisclosure agreement updates']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444421', 'Technical Writing Workshop', '2026-08-27', '2:00 PM', '60m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333340', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222222', 'upcoming', 'low', ARRAY['Formatting style guide', 'Standardizing API documentation']),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444422', 'Cross-functional Alignment', '2026-08-28', '1:00 PM', '90m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333331', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222232', 'upcoming', 'high', ARRAY['Address department interface overlaps', 'Review roadmap timelines']),
-- Edge Case: Long text meeting title & agenda
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444423', 'Detailed Architectural Analysis of the Scalability Blockers Affecting Distributed Web App Nodes and Edge Function Failovers', '2026-08-29', '10:00 AM', '60m', 'b20b22b3-4f2b-5d8b-9c2f-3f3b33333331', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221', 'upcoming', 'medium', ARRAY['Review current memory consumption limits of globally distributed edge gateways', 'Analyze database replica lag metrics and determine optimal read-write routing', 'Determine mitigation strategies for handling unexpected geographic spikes in network traffic']);

-- ----------------------------------------------------------------------------
-- 4. Meeting Attendees Junction Table
-- ----------------------------------------------------------------------------
CREATE TABLE meeting_attendees (
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    PRIMARY KEY (meeting_id, employee_id)
);

-- Insert Attendees mappings for meetings
-- Keep Sarah Chen (22222221) and Marcus Reed (22222222) in many meetings so they display on dashboard
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES
-- m1: Sarah Chen, Marcus Reed, Priya Nair, David Okoye
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444401', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444401', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222222'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444401', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222223'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444401', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222224'),
-- m2: David Okoye, Marcus Reed, Aisha Khan
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444402', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222224'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444402', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222222'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444402', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222227'),
-- m3: Priya Nair, Sarah Chen
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444403', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222223'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444403', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221'),
-- m4: Elena Rossi, Tom Walsh
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444404', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222225'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444404', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222226'),
-- m5: Tom Walsh, Sarah Chen, Carlos Mendez
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444405', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222226'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444405', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444405', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222228'),
-- m6: Sarah Chen, David Okoye, Elena Rossi, Tom Walsh, Aisha Khan
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444406', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444406', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222224'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444406', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222225'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444406', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222226'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444406', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222227'),
-- m7: Aisha Khan, Marcus Reed
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444407', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222227'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444407', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222222'),
-- m8: Carlos Mendez, Tom Walsh
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444408', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222228'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444408', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222226'),
-- m9: Jane Smith, John Doe, Carlos Mendez
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444409', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222230'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444409', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222229'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444409', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222228'),
-- m10: John Doe, Sarah Chen, Beatrice Vance
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444410', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222229'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444410', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444410', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222232'),
-- m11: Marcus Reed, David Okoye
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444411', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222222'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444411', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222224'),
-- m12: Priya Nair, Sarah Chen, Marcus Reed
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444412', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222223'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444412', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444412', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222222'),
-- m13: Sarah Chen, Marcus Reed, Priya Nair, David Okoye, Elena Rossi, Tom Walsh
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444413', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444413', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222222'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444413', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222223'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444413', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222224'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444413', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222225'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444413', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222226'),
-- m14: Sarah Chen, Marcus Reed
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444414', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444414', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222222'),
-- m15: David Okoye, Marcus Reed, Priya Nair, Aisha Khan
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444415', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222224'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444415', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222222'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444415', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222223'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444415', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222227'),
-- m16: Elena Rossi, Tom Walsh
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444416', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222225'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444416', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222226'),
-- m17: Marcus Reed, David Okoye, Carlos Mendez
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444417', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222222'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444417', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222224'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444417', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222228'),
-- m18: Tom Walsh, Carlos Mendez, Jane Smith
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444418', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222226'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444418', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222228'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444418', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222230'),
-- m19: Carlos Mendez, Tom Walsh, Sarah Chen, Elena Rossi, John Doe, Jane Smith
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444419', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222228'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444419', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222226'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444419', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444419', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222225'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444419', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222229'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444419', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222230'),
-- m20: Robert Draper, Beatrice Vance
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444420', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222233'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444420', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222232'),
-- m21: Marcus Reed, Aisha Khan, Linus Torvalds
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444421', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222222'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444421', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222227'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444421', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222231'),
-- m22: Beatrice Vance, Sarah Chen, Tom Walsh
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444422', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222232'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444422', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444422', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222226'),
-- m23: Sarah Chen, David Okoye, Marcus Reed, Priya Nair
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444423', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222221'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444423', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222224'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444423', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222222'),
('d30c33c4-5f3c-6d9c-0d3a-4f4c44444423', 'c10a11a2-3f1a-4d7a-8b1e-2e2a22222223');

-- ----------------------------------------------------------------------------
-- 5. Tasks Table (At least 10 records)
-- ----------------------------------------------------------------------------
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    due_date DATE NOT NULL,
    priority priority_level DEFAULT 'medium'::priority_level NOT NULL,
    status task_status DEFAULT 'todo'::task_status NOT NULL,
    related_meeting_id UUID REFERENCES meetings(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for tasks due dates and status filters
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);

-- Insert Tasks (15 records - exceeds requirement of 10 tasks)
INSERT INTO tasks (id, title, due_date, priority, status, related_meeting_id) VALUES
('f40d44d5-6f4d-7e0d-1e4b-5f5d55555501', 'Prepare Q3 roadmap slides', '2026-08-21', 'high', 'in-progress', 'd30c33c4-5f3c-6d9c-0d3a-4f4c44444401'),
('f40d44d5-6f4d-7e0d-1e4b-5f5d55555502', 'Send sprint retrospective notes', '2026-08-22', 'medium', 'todo', 'd30c33c4-5f3c-6d9c-0d3a-4f4c44444402'),
('f40d44d5-6f4d-7e0d-1e4b-5f5d55555503', 'Update component library docs', '2026-08-23', 'low', 'todo', 'd30c33c4-5f3c-6d9c-0d3a-4f4c44444403'),
('f40d44d5-6f4d-7e0d-1e4b-5f5d55555504', 'Collect campaign performance metrics', '2026-08-20', 'medium', 'done', 'd30c33c4-5f3c-6d9c-0d3a-4f4c44444404'),
('f40d44d5-6f4d-7e0d-1e4b-5f5d55555505', 'Draft customer health report', '2026-08-21', 'high', 'in-progress', 'd30c33c4-5f3c-6d9c-0d3a-4f4c44444405'),
('f40d44d5-6f4d-7e0d-1e4b-5f5d55555506', 'Prepare townhall presentation', '2026-08-23', 'high', 'todo', 'd30c33c4-5f3c-6d9c-0d3a-4f4c44444406'),
('f40d44d5-6f4d-7e0d-1e4b-5f5d55555507', 'Review budget spreadsheet', '2026-08-18', 'high', 'done', 'd30c33c4-5f3c-6d9c-0d3a-4f4c44444409'),
('f40d44d5-6f4d-7e0d-1e4b-5f5d55555508', 'Draft legal contract templates', '2026-08-21', 'medium', 'in-progress', 'd30c33c4-5f3c-6d9c-0d3a-4f4c44444420'),
('f40d44d5-6f4d-7e0d-1e4b-5f5d55555509', 'Deploy emergency hotfix', '2026-08-21', 'high', 'done', 'd30c33c4-5f3c-6d9c-0d3a-4f4c44444417'),
('f40d44d5-6f4d-7e0d-1e4b-5f5d55555510', 'Schedule new employee onboarding', '2026-08-24', 'low', 'todo', 'd30c33c4-5f3c-6d9c-0d3a-4f4c44444410'),
('f40d44d5-6f4d-7e0d-1e4b-5f5d55555511', 'Compile sales enablement materials', '2026-08-26', 'medium', 'todo', 'd30c33c4-5f3c-6d9c-0d3a-4f4c44444418'),
('f40d44d5-6f4d-7e0d-1e4b-5f5d55555512', 'Complete security questionnaire', '2026-08-20', 'high', 'done', 'd30c33c4-5f3c-6d9c-0d3a-4f4c44444411'),
('f40d44d5-6f4d-7e0d-1e4b-5f5d55555513', 'Review marketing design assets', '2026-08-22', 'low', 'in-progress', 'd30c33c4-5f3c-6d9c-0d3a-4f4c44444403'),
-- Edge Case: Task with NO related meeting (nullable relation)
('f40d44d5-6f4d-7e0d-1e4b-5f5d55555514', 'Clean up focus pod layout', '2026-08-25', 'low', 'done', NULL),
-- Edge Case: Very long task title / description
('f40d44d5-6f4d-7e0d-1e4b-5f5d55555515', 'Investigate why the database read query latency spikes and blocks API gateway connections during peak execution schedules and prepare documentation for the engineering infrastructure team.', '2026-08-28', 'medium', 'todo', 'd30c33c4-5f3c-6d9c-0d3a-4f4c44444407');
