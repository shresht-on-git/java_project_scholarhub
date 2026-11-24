-- ScholarHub Database Schema (MySQL 8)

CREATE DATABASE IF NOT EXISTS scholarhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE scholarhub;

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

-- Initial Seed Data (if subjects table is empty)
INSERT INTO subjects (course_code, name, location, total_classes, attended_classes, missed_classes)
SELECT 'CS301', 'Data Structures & Algorithms', 'Hall 101', 20, 12, 8
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE course_code = 'CS301');

INSERT INTO subjects (course_code, name, location, total_classes, attended_classes, missed_classes)
SELECT 'CS305', 'Operating Systems', 'Lab 3', 20, 18, 2
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE course_code = 'CS305');

INSERT INTO subjects (course_code, name, location, total_classes, attended_classes, missed_classes)
SELECT 'CS310', 'Machine Learning', 'Auditorium A', 0, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE course_code = 'CS310');
