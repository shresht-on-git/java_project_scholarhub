-- ScholarHub Database Schema (MySQL 8)

CREATE DATABASE IF NOT EXISTS scholarhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE scholarhub;

-- Optional manual flush / reset commands (run only when you need a full clean reset):
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE IF EXISTS attendance_logs;
-- DROP TABLE IF EXISTS subjects;
-- DROP TABLE IF EXISTS students;
-- SET FOREIGN_KEY_CHECKS = 1;

-- Table: students
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

-- Seed 30 Students (Idempotent: inserts only if roll_number does not exist)
INSERT INTO students (roll_number, full_name, email, password, branch, semester)
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
WHERE NOT EXISTS (SELECT 1 FROM students WHERE students.roll_number = tmp.r);

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
