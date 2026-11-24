-- ScholarHub Database Schema (MySQL 8)

CREATE DATABASE IF NOT EXISTS scholarhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE scholarhub;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    branch VARCHAR(255) NOT NULL,
    semester INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: students (for backward compatibility)
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    branch VARCHAR(255) NOT NULL,
    semester INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: subjects
CREATE TABLE IF NOT EXISTS subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) DEFAULT 'TBA',
    total_classes INT NOT NULL DEFAULT 0,
    attended_classes INT NOT NULL DEFAULT 0,
    missed_classes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_total_gte_attended CHECK (total_classes >= attended_classes),
    CONSTRAINT chk_attended_gte_zero CHECK (attended_classes >= 0),
    CONSTRAINT chk_missed_gte_zero CHECK (missed_classes >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: attendance_logs
CREATE TABLE IF NOT EXISTS attendance_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject_id BIGINT NOT NULL,
    log_date DATE NOT NULL,
    status ENUM('PRESENT', 'ABSENT') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_subject
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: projects
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    team_size INT NOT NULL,
    team_lead_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_team_lead
        FOREIGN KEY (team_lead_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: project_members
CREATE TABLE IF NOT EXISTS project_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role ENUM('TEAM_LEAD', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    overall_task VARCHAR(255),
    overall_task_deadline DATE,
    overall_task_completed BOOLEAN NOT NULL DEFAULT FALSE,
    overdue_notified BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMP NULL,
    CONSTRAINT uk_project_member UNIQUE (project_id, user_id),
    CONSTRAINT fk_member_project
        FOREIGN KEY (project_id) REFERENCES projects(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_member_user
        FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: subtasks
CREATE TABLE IF NOT EXISTS subtasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_member_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    deadline DATE NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    overdue_notified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subtask_member
        FOREIGN KEY (project_member_id) REFERENCES project_members(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: project_messages
CREATE TABLE IF NOT EXISTS project_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_message_project
        FOREIGN KEY (project_id) REFERENCES projects(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_message_sender
        FOREIGN KEY (sender_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_id BIGINT NOT NULL,
    project_id BIGINT,
    message TEXT NOT NULL,
    type ENUM('INVITATION', 'TASK_COMPLETED', 'TASK_OVERDUE', 'SUBTASK_COMPLETED', 'SUBTASK_OVERDUE') NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_recipient
        FOREIGN KEY (recipient_id) REFERENCES users(id),
    CONSTRAINT fk_notification_project
        FOREIGN KEY (project_id) REFERENCES projects(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed 30 Students into users table (Idempotent)
INSERT INTO users (roll_number, full_name, email, password, branch, semester)
SELECT * FROM (
    SELECT '102403001' AS r, 'Aarav Sharma' AS n, 'aarav.sharma@scholarhub.edu' AS e, 'password123' AS p, 'Computer Engineering' AS b, 5 AS s UNION ALL
    SELECT '102403002', 'Ananya Verma', 'ananya.verma@scholarhub.edu', 'password123', 'Computer Engineering', 5 UNION ALL
    SELECT '102403003', 'Rohan Mehta', 'rohan.mehta@scholarhub.edu', 'password123', 'Computer Science', 5 UNION ALL
    SELECT '102403004', 'Priya Nair', 'priya.nair@scholarhub.edu', 'password123', 'Electronics & Comm', 3 UNION ALL
    SELECT '102403005', 'Kabir Singh', 'kabir.singh@scholarhub.edu', 'password123', 'Computer Engineering', 5 UNION ALL
    SELECT '102403006', 'Ishita Gupta', 'ishita.gupta@scholarhub.edu', 'password123', 'Computer Science', 5 UNION ALL
    SELECT '102403007', 'Vihaan Malhotra', 'vihaan.malhotra@scholarhub.edu', 'password123', 'Mechanical Engineering', 7 UNION ALL
    SELECT '102403008', 'Diya Patel', 'diya.patel@scholarhub.edu', 'password123', 'Computer Engineering', 3 UNION ALL
    SELECT '102403009', 'Arjun Kapoor', 'arjun.kapoor@scholarhub.edu', 'password123', 'Electronics & Comm', 5 UNION ALL
    SELECT '102403010', 'Sanya Bansal', 'sanya.bansal@scholarhub.edu', 'password123', 'Computer Science', 5 UNION ALL
    SELECT '102403011', 'Devansh Joshi', 'devansh.joshi@scholarhub.edu', 'password123', 'Computer Engineering', 7 UNION ALL
    SELECT '102403012', 'Meera Iyer', 'meera.iyer@scholarhub.edu', 'password123', 'Artificial Intelligence', 3 UNION ALL
    SELECT '102403013', 'Aditya Rao', 'aditya.rao@scholarhub.edu', 'password123', 'Computer Engineering', 5 UNION ALL
    SELECT '102403014', 'Kavya Reddy', 'kavya.reddy@scholarhub.edu', 'password123', 'Computer Science', 5 UNION ALL
    SELECT '102403015', 'Harshvardhan Gill', 'harsh.gill@scholarhub.edu', 'password123', 'Mechanical Engineering', 3 UNION ALL
    SELECT '102403016', 'Neha Kulkarni', 'neha.kulkarni@scholarhub.edu', 'password123', 'Computer Engineering', 5 UNION ALL
    SELECT '102403017', 'Siddharth Jain', 'siddharth.jain@scholarhub.edu', 'password123', 'Data Science', 5 UNION ALL
    SELECT '102403018', 'Riya Choudhary', 'riya.choudhary@scholarhub.edu', 'password123', 'Computer Science', 7 UNION ALL
    SELECT '102403019', 'Pranav Deshmukh', 'pranav.deshmukh@scholarhub.edu', 'password123', 'Electronics & Comm', 5 UNION ALL
    SELECT '102403020', 'Tanya Aggarwal', 'tanya.aggarwal@scholarhub.edu', 'password123', 'Computer Engineering', 5 UNION ALL
    SELECT '102403021', 'Yashwant Thakur', 'yashwant.thakur@scholarhub.edu', 'password123', 'Civil Engineering', 3 UNION ALL
    SELECT '102403022', 'Simran Kaur', 'simran.kaur@scholarhub.edu', 'password123', 'Computer Engineering', 5 UNION ALL
    SELECT '102403023', 'Nikhil Bhatia', 'nikhil.bhatia@scholarhub.edu', 'password123', 'Computer Science', 5 UNION ALL
    SELECT '102403024', 'Aditi Saxena', 'aditi.saxena@scholarhub.edu', 'password123', 'Artificial Intelligence', 3 UNION ALL
    SELECT '102403025', 'Kunal Khanna', 'kunal.khanna@scholarhub.edu', 'password123', 'Computer Engineering', 7 UNION ALL
    SELECT '102403026', 'Shruti Mishra', 'shruti.mishra@scholarhub.edu', 'password123', 'Data Science', 5 UNION ALL
    SELECT '102403027', 'Manav Sethi', 'manav.sethi@scholarhub.edu', 'password123', 'Computer Engineering', 5 UNION ALL
    SELECT '102403028', 'Pooja Tiwari', 'pooja.tiwari@scholarhub.edu', 'password123', 'Electronics & Comm', 3 UNION ALL
    SELECT '102403029', 'Gaurav Saini', 'gaurav.saini@scholarhub.edu', 'password123', 'Computer Science', 5 UNION ALL
    SELECT '102403030', 'Nandini Arora', 'nandini.arora@scholarhub.edu', 'password123', 'Computer Engineering', 5
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE users.roll_number = tmp.r);

-- Initial Subject Data (if subjects table is empty)
INSERT INTO subjects (course_code, name, location, total_classes, attended_classes, missed_classes)
SELECT 'CS301', 'Data Structures & Algorithms', 'Hall 101', 20, 12, 8
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE course_code = 'CS301');

INSERT INTO subjects (course_code, name, location, total_classes, attended_classes, missed_classes)
SELECT 'CS305', 'Operating Systems', 'Lab 3', 20, 18, 2
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE course_code = 'CS305');

INSERT INTO subjects (course_code, name, location, total_classes, attended_classes, missed_classes)
SELECT 'CS310', 'Machine Learning', 'Auditorium A', 0, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE course_code = 'CS310');
