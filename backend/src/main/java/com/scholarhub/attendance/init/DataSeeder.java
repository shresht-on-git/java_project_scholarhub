package com.scholarhub.attendance.init;

import com.scholarhub.attendance.entity.AttendanceLog;
import com.scholarhub.attendance.entity.AttendanceStatus;
import com.scholarhub.attendance.entity.Student;
import com.scholarhub.attendance.entity.Subject;
import com.scholarhub.attendance.repository.AttendanceLogRepository;
import com.scholarhub.attendance.repository.StudentRepository;
import com.scholarhub.attendance.repository.SubjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final AttendanceLogRepository attendanceLogRepository;

    public DataSeeder(StudentRepository studentRepository,
                      SubjectRepository subjectRepository,
                      AttendanceLogRepository attendanceLogRepository) {
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.attendanceLogRepository = attendanceLogRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedStudents();
        seedSubjects();
    }

    private void seedStudents() {
        // Idempotent check: if Aarav Sharma is already present and 30 students are seeded, skip
        if (studentRepository.existsByEmailIgnoreCase("aarav.sharma@scholarhub.edu") && studentRepository.count() >= 30) {
            log.info("Student records already initialized ({} found). Skipping student seeding.", studentRepository.count());
            return;
        }

        // Clean out any old/dummy records that do not belong to the official 30 students
        long existingCount = studentRepository.count();
        if (existingCount > 0 && !studentRepository.existsByEmailIgnoreCase("aarav.sharma@scholarhub.edu")) {
            log.warn("Clearing {} outdated dummy student records before seeding new 30 students...", existingCount);
            studentRepository.deleteAll();
        }

        log.info("Seeding 30 official ScholarHub students...");

        List<Student> students = new ArrayList<>();
        addStudentIfMissing(students, "102403001", "Aarav Sharma", "aarav.sharma@scholarhub.edu", "password123", "Computer Engineering", 5);
        addStudentIfMissing(students, "102403002", "Ananya Verma", "ananya.verma@scholarhub.edu", "password123", "Computer Engineering", 5);
        addStudentIfMissing(students, "102403003", "Rohan Mehta", "rohan.mehta@scholarhub.edu", "password123", "Computer Science", 5);
        addStudentIfMissing(students, "102403004", "Priya Nair", "priya.nair@scholarhub.edu", "password123", "Electronics & Comm", 3);
        addStudentIfMissing(students, "102403005", "Kabir Singh", "kabir.singh@scholarhub.edu", "password123", "Computer Engineering", 5);
        addStudentIfMissing(students, "102403006", "Ishita Gupta", "ishita.gupta@scholarhub.edu", "password123", "Computer Science", 5);
        addStudentIfMissing(students, "102403007", "Vihaan Malhotra", "vihaan.malhotra@scholarhub.edu", "password123", "Mechanical Engineering", 7);
        addStudentIfMissing(students, "102403008", "Diya Patel", "diya.patel@scholarhub.edu", "password123", "Computer Engineering", 3);
        addStudentIfMissing(students, "102403009", "Arjun Kapoor", "arjun.kapoor@scholarhub.edu", "password123", "Electronics & Comm", 5);
        addStudentIfMissing(students, "102403010", "Sanya Bansal", "sanya.bansal@scholarhub.edu", "password123", "Computer Science", 5);
        addStudentIfMissing(students, "102403011", "Devansh Joshi", "devansh.joshi@scholarhub.edu", "password123", "Computer Engineering", 7);
        addStudentIfMissing(students, "102403012", "Meera Iyer", "meera.iyer@scholarhub.edu", "password123", "Artificial Intelligence", 3);
        addStudentIfMissing(students, "102403013", "Aditya Rao", "aditya.rao@scholarhub.edu", "password123", "Computer Engineering", 5);
        addStudentIfMissing(students, "102403014", "Kavya Reddy", "kavya.reddy@scholarhub.edu", "password123", "Computer Science", 5);
        addStudentIfMissing(students, "102403015", "Harshvardhan Gill", "harsh.gill@scholarhub.edu", "password123", "Mechanical Engineering", 3);
        addStudentIfMissing(students, "102403016", "Neha Kulkarni", "neha.kulkarni@scholarhub.edu", "password123", "Computer Engineering", 5);
        addStudentIfMissing(students, "102403017", "Siddharth Jain", "siddharth.jain@scholarhub.edu", "password123", "Data Science", 5);
        addStudentIfMissing(students, "102403018", "Riya Choudhary", "riya.choudhary@scholarhub.edu", "password123", "Computer Science", 7);
        addStudentIfMissing(students, "102403019", "Pranav Deshmukh", "pranav.deshmukh@scholarhub.edu", "password123", "Electronics & Comm", 5);
        addStudentIfMissing(students, "102403020", "Tanya Aggarwal", "tanya.aggarwal@scholarhub.edu", "password123", "Computer Engineering", 5);
        addStudentIfMissing(students, "102403021", "Yashwant Thakur", "yashwant.thakur@scholarhub.edu", "password123", "Civil Engineering", 3);
        addStudentIfMissing(students, "102403022", "Simran Kaur", "simran.kaur@scholarhub.edu", "password123", "Computer Engineering", 5);
        addStudentIfMissing(students, "102403023", "Nikhil Bhatia", "nikhil.bhatia@scholarhub.edu", "password123", "Computer Science", 5);
        addStudentIfMissing(students, "102403024", "Aditi Saxena", "aditi.saxena@scholarhub.edu", "password123", "Artificial Intelligence", 3);
        addStudentIfMissing(students, "102403025", "Kunal Khanna", "kunal.khanna@scholarhub.edu", "password123", "Computer Engineering", 7);
        addStudentIfMissing(students, "102403026", "Shruti Mishra", "shruti.mishra@scholarhub.edu", "password123", "Data Science", 5);
        addStudentIfMissing(students, "102403027", "Manav Sethi", "manav.sethi@scholarhub.edu", "password123", "Computer Engineering", 5);
        addStudentIfMissing(students, "102403028", "Pooja Tiwari", "pooja.tiwari@scholarhub.edu", "password123", "Electronics & Comm", 3);
        addStudentIfMissing(students, "102403029", "Gaurav Saini", "gaurav.saini@scholarhub.edu", "password123", "Computer Science", 5);
        addStudentIfMissing(students, "102403030", "Nandini Arora", "nandini.arora@scholarhub.edu", "password123", "Computer Engineering", 5);

        if (!students.isEmpty()) {
            studentRepository.saveAll(students);
            log.info("Successfully seeded {} new student records into the database.", students.size());
        }
    }

    private void addStudentIfMissing(List<Student> list, String roll, String name, String email, String pwd, String branch, int sem) {
        if (!studentRepository.existsByRollNumber(roll) && !studentRepository.existsByEmailIgnoreCase(email)) {
            list.add(Student.builder()
                    .rollNumber(roll)
                    .fullName(name)
                    .email(email)
                    .password(pwd)
                    .branch(branch)
                    .semester(sem)
                    .build());
        }
    }

    private void seedSubjects() {
        if (subjectRepository.count() == 0) {
            log.info("No existing subjects detected. Seeding sample curriculum data...");

            // 1. Below 75% threshold (12/20 = 60.0% -> Low Attendance)
            Subject s1 = Subject.builder()
                    .courseCode("CS301")
                    .name("Data Structures & Algorithms")
                    .location("Hall 101")
                    .attendedClasses(12)
                    .missedClasses(8)
                    .totalClasses(20)
                    .build();

            // 2. Above 75% threshold (18/20 = 90.0% -> Safe)
            Subject s2 = Subject.builder()
                    .courseCode("CS305")
                    .name("Operating Systems")
                    .location("Lab 3")
                    .attendedClasses(18)
                    .missedClasses(2)
                    .totalClasses(20)
                    .build();

            // 3. Zero classes (0/0 = 0.0% -> NO_DATA, test no NaN% division by zero)
            Subject s3 = Subject.builder()
                    .courseCode("CS310")
                    .name("Machine Learning")
                    .location("Auditorium A")
                    .attendedClasses(0)
                    .missedClasses(0)
                    .totalClasses(0)
                    .build();

            subjectRepository.saveAll(List.of(s1, s2, s3));

            LocalDate today = LocalDate.now();
            attendanceLogRepository.save(AttendanceLog.builder()
                    .subject(s1)
                    .logDate(today.minusDays(1))
                    .status(AttendanceStatus.PRESENT)
                    .build());
            attendanceLogRepository.save(AttendanceLog.builder()
                    .subject(s1)
                    .logDate(today.minusDays(2))
                    .status(AttendanceStatus.ABSENT)
                    .build());
            attendanceLogRepository.save(AttendanceLog.builder()
                    .subject(s2)
                    .logDate(today.minusDays(1))
                    .status(AttendanceStatus.PRESENT)
                    .build());

            log.info("Successfully seeded curriculum subjects and demo logs.");
        }
    }
}
