-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student','teacher','admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------

-- COURSES
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    duration_months INTEGER,
    price NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------

-- BATCHES
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------

-- MODULES
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------

-- ASSIGNMENTS
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    deadline TIMESTAMP,
    max_score INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------

-- STUDENT ENROLLMENTS
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(student_id, course_id)
);

---------------------------------------------------

-- TEACHER ASSIGNMENTS
CREATE TABLE teacher_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------

-- LIVE CLASSES
CREATE TABLE live_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    title TEXT NOT NULL,

    scheduled_at TIMESTAMP NOT NULL,

    meeting_link TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------

-- ATTENDANCE
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    live_class_id UUID NOT NULL REFERENCES live_classes(id) ON DELETE CASCADE,

    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    attended BOOLEAN DEFAULT FALSE,

    attendance_time TIMESTAMP,

    UNIQUE(live_class_id, student_id)
);

---------------------------------------------------

-- ASSIGNMENT SUBMISSIONS
CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,

    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    status TEXT DEFAULT 'not_submitted'
        CHECK (
            status IN (
                'submitted',
                'not_submitted',
                'late'
            )
        ),

    score INTEGER,

    submitted_at TIMESTAMP,

    UNIQUE(assignment_id, student_id)
);

---------------------------------------------------

-- PROGRESS
CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

    modules_completed INTEGER DEFAULT 0,

    assignments_completed INTEGER DEFAULT 0,

    attendance_percentage NUMERIC(5,2) DEFAULT 0,

    overall_progress NUMERIC(5,2) DEFAULT 0,

    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(student_id, course_id)
);

---------------------------------------------------

-- RECORDED CLASSES
CREATE TABLE recorded_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,

    title TEXT NOT NULL,

    video_url TEXT,

    duration_minutes INTEGER,

    created_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------

-- DOCUMENTS FOR RAG
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,

    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,

    title TEXT NOT NULL,

    file_url TEXT NOT NULL,

    role_access TEXT[] DEFAULT ARRAY['student'],

    uploaded_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------

-- ANNOUNCEMENTS
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,

    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,

    title TEXT NOT NULL,

    content TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);