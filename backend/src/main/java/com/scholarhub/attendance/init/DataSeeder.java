package com.scholarhub.attendance.init;

import com.scholarhub.attendance.dto.CreateProjectRequest;
import com.scholarhub.attendance.entity.*;
import com.scholarhub.attendance.repository.*;
import com.scholarhub.attendance.service.ProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final AttendanceLogRepository attendanceLogRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final SubtaskRepository subtaskRepository;
    private final ProjectMessageRepository projectMessageRepository;

    public DataSeeder(UserRepository userRepository,
                      StudentRepository studentRepository,
                      SubjectRepository subjectRepository,
                      AttendanceLogRepository attendanceLogRepository,
                      ProjectRepository projectRepository,
                      ProjectMemberRepository projectMemberRepository,
                      SubtaskRepository subtaskRepository,
                      ProjectMessageRepository projectMessageRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.attendanceLogRepository = attendanceLogRepository;
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.subtaskRepository = subtaskRepository;
        this.projectMessageRepository = projectMessageRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedUsersAndStudents();
        seedSubjects();
        seedSampleProject();
    }

    private void seedUsersAndStudents() {
        if (userRepository.existsByEmailIgnoreCase("aarav.sharma@scholarhub.edu") && userRepository.count() >= 30) {
            log.info("User records already initialized ({} found).", userRepository.count());
            return;
        }

        log.info("Seeding 30 official ScholarHub students into users and students tables...");

        String[][] rawStudents = {
                {"102403001", "Aarav Sharma", "aarav.sharma@scholarhub.edu", "password123", "Computer Engineering", "5"},
                {"102403002", "Ananya Verma", "ananya.verma@scholarhub.edu", "password123", "Computer Engineering", "5"},
                {"102403003", "Rohan Mehta", "rohan.mehta@scholarhub.edu", "password123", "Computer Science", "5"},
                {"102403004", "Priya Nair", "priya.nair@scholarhub.edu", "password123", "Electronics & Comm", "3"},
                {"102403005", "Kabir Singh", "kabir.singh@scholarhub.edu", "password123", "Computer Engineering", "5"},
                {"102403006", "Ishita Gupta", "ishita.gupta@scholarhub.edu", "password123", "Computer Science", "5"},
                {"102403007", "Vihaan Malhotra", "vihaan.malhotra@scholarhub.edu", "password123", "Mechanical Engineering", "7"},
                {"102403008", "Diya Patel", "diya.patel@scholarhub.edu", "password123", "Computer Engineering", "3"},
                {"102403009", "Arjun Kapoor", "arjun.kapoor@scholarhub.edu", "password123", "Electronics & Comm", "5"},
                {"102403010", "Sanya Bansal", "sanya.bansal@scholarhub.edu", "password123", "Computer Science", "5"},
                {"102403011", "Devansh Joshi", "devansh.joshi@scholarhub.edu", "password123", "Computer Engineering", "7"},
                {"102403012", "Meera Iyer", "meera.iyer@scholarhub.edu", "password123", "Artificial Intelligence", "3"},
                {"102403013", "Aditya Rao", "aditya.rao@scholarhub.edu", "password123", "Computer Engineering", "5"},
                {"102403014", "Kavya Reddy", "kavya.reddy@scholarhub.edu", "password123", "Computer Science", "5"},
                {"102403015", "Harshvardhan Gill", "harsh.gill@scholarhub.edu", "password123", "Mechanical Engineering", "3"},
                {"102403016", "Neha Kulkarni", "neha.kulkarni@scholarhub.edu", "password123", "Computer Engineering", "5"},
                {"102403017", "Siddharth Jain", "siddharth.jain@scholarhub.edu", "password123", "Data Science", "5"},
                {"102403018", "Riya Choudhary", "riya.choudhary@scholarhub.edu", "password123", "Computer Science", "7"},
                {"102403019", "Pranav Deshmukh", "pranav.deshmukh@scholarhub.edu", "password123", "Electronics & Comm", "5"},
                {"102403020", "Tanya Aggarwal", "tanya.aggarwal@scholarhub.edu", "password123", "Computer Engineering", "5"},
                {"102403021", "Yashwant Thakur", "yashwant.thakur@scholarhub.edu", "password123", "Civil Engineering", "3"},
                {"102403022", "Simran Kaur", "simran.kaur@scholarhub.edu", "password123", "Computer Engineering", "5"},
                {"102403023", "Nikhil Bhatia", "nikhil.bhatia@scholarhub.edu", "password123", "Computer Science", "5"},
                {"102403024", "Aditi Saxena", "aditi.saxena@scholarhub.edu", "password123", "Artificial Intelligence", "3"},
                {"102403025", "Kunal Khanna", "kunal.khanna@scholarhub.edu", "password123", "Computer Engineering", "7"},
                {"102403026", "Shruti Mishra", "shruti.mishra@scholarhub.edu", "password123", "Data Science", "5"},
                {"102403027", "Manav Sethi", "manav.sethi@scholarhub.edu", "password123", "Computer Engineering", "5"},
                {"102403028", "Pooja Tiwari", "pooja.tiwari@scholarhub.edu", "password123", "Electronics & Comm", "3"},
                {"102403029", "Gaurav Saini", "gaurav.saini@scholarhub.edu", "password123", "Computer Science", "5"},
                {"102403030", "Nandini Arora", "nandini.arora@scholarhub.edu", "password123", "Computer Engineering", "5"}
        };

        for (String[] r : rawStudents) {
            String roll = r[0];
            String name = r[1];
            String email = r[2];
            String pwd = r[3];
            String branch = r[4];
            int sem = Integer.parseInt(r[5]);

            if (!userRepository.existsByRollNumber(roll)) {
                userRepository.save(User.builder()
                        .rollNumber(roll)
                        .fullName(name)
                        .email(email)
                        .password(pwd)
                        .branch(branch)
                        .semester(sem)
                        .build());
            }

            if (!studentRepository.existsByRollNumber(roll)) {
                studentRepository.save(Student.builder()
                        .rollNumber(roll)
                        .fullName(name)
                        .email(email)
                        .password(pwd)
                        .branch(branch)
                        .semester(sem)
                        .build());
            }
        }

        log.info("Successfully synchronized {} users and students.", userRepository.count());
    }

    private void seedSubjects() {
        if (subjectRepository.count() == 0) {
            log.info("No existing subjects detected. Seeding sample curriculum data...");

            Subject s1 = Subject.builder()
                    .courseCode("CS301")
                    .name("Data Structures & Algorithms")
                    .location("Hall 101")
                    .attendedClasses(12)
                    .missedClasses(8)
                    .totalClasses(20)
                    .build();

            Subject s2 = Subject.builder()
                    .courseCode("CS305")
                    .name("Operating Systems")
                    .location("Lab 3")
                    .attendedClasses(18)
                    .missedClasses(2)
                    .totalClasses(20)
                    .build();

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

    private void seedSampleProject() {
        if (projectRepository.count() == 0) {
            User lead = userRepository.findByRollNumber("102403001").orElse(null);
            User member1 = userRepository.findByRollNumber("102403002").orElse(null); // Ananya Verma
            User member2 = userRepository.findByRollNumber("102403003").orElse(null); // Rohan Mehta

            if (lead != null && member1 != null && member2 != null) {
                log.info("Seeding sample collaboration project 'ScholarHub Academic Suite'...");

                Project project = Project.builder()
                        .title("ScholarHub Academic Portal Capstone")
                        .description("Full-stack academic performance and project self-management dashboard for university students.")
                        .teamSize(4)
                        .teamLead(lead)
                        .build();

                Project savedProject = projectRepository.save(project);

                // Team Lead (Aarav Sharma)
                ProjectMember mLead = ProjectMember.builder()
                        .project(savedProject)
                        .user(lead)
                        .role(ProjectRole.TEAM_LEAD)
                        .status(MemberStatus.ACCEPTED)
                        .overallTask("System Architecture & Backend API")
                        .overallTaskDeadline(LocalDate.now().plusDays(14))
                        .overallTaskCompleted(false)
                        .joinedAt(LocalDateTime.now().minusDays(5))
                        .build();
                projectMemberRepository.save(mLead);

                // Member 1 (Ananya Verma) - Accepted
                ProjectMember m1 = ProjectMember.builder()
                        .project(savedProject)
                        .user(member1)
                        .role(ProjectRole.MEMBER)
                        .status(MemberStatus.ACCEPTED)
                        .overallTask("React UI & Tailwind Components")
                        .overallTaskDeadline(LocalDate.now().plusDays(10))
                        .overallTaskCompleted(false)
                        .joinedAt(LocalDateTime.now().minusDays(4))
                        .build();
                projectMemberRepository.save(m1);

                // Member 2 (Rohan Mehta) - Pending invitation
                ProjectMember m2 = ProjectMember.builder()
                        .project(savedProject)
                        .user(member2)
                        .role(ProjectRole.MEMBER)
                        .status(MemberStatus.PENDING)
                        .build();
                projectMemberRepository.save(m2);

                // Subtasks for Lead
                subtaskRepository.save(Subtask.builder()
                        .projectMember(mLead)
                        .title("Configure Spring Data JPA & MySQL Schema")
                        .deadline(LocalDate.now().plusDays(3))
                        .completed(true)
                        .build());
                subtaskRepository.save(Subtask.builder()
                        .projectMember(mLead)
                        .title("Implement REST Controllers & Role Security")
                        .deadline(LocalDate.now().plusDays(7))
                        .completed(false)
                        .build());

                // Subtasks for Member 1
                subtaskRepository.save(Subtask.builder()
                        .projectMember(m1)
                        .title("Build Projects Grid & Navigation Layout")
                        .deadline(LocalDate.now().plusDays(4))
                        .completed(false)
                        .build());

                // Sample chat messages
                projectMessageRepository.save(ProjectMessage.builder()
                        .project(savedProject)
                        .sender(lead)
                        .content("Welcome team! Let's build a rock-solid project workspace.")
                        .build());
                projectMessageRepository.save(ProjectMessage.builder()
                        .project(savedProject)
                        .sender(member1)
                        .content("Excited to work on the Tailwind and React UI components!")
                        .build());

                log.info("Successfully seeded sample project with lead, members, subtasks, and messages.");
            }
        }
    }
}
