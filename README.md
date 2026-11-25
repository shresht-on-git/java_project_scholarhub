# ScholarHub - Student Academic Self-Management & Team Collaboration Platform

[![Live Demo](https://img.shields.io/badge/Demo-scholarhub--java.vercel.app-blueviolet?style=for-the-badge&logo=vercel)](https://scholarhub-java.vercel.app)
[![Java](https://img.shields.io/badge/Java-17%2B-orange?style=for-the-badge&logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

ScholarHub is a modern, full-stack academic self-management and team collaboration dashboard designed for university students. It combines a rigorous 75% attendance threshold tracking engine with project management, subtask breakdown workflows, real-time group chat, deadline notification scheduling, and student profile portfolio management.

---

## 🌐 Live Deployment

- **Frontend Application (Vercel):** [https://scholarhub-java.vercel.app](https://scholarhub-java.vercel.app)
- **Backend API (Render Docker):** Containerized Spring Boot 3 microservice with automated health checks.

---

## 🌟 Key Modules & Capabilities

### 1. 📅 Attendance Tracking & 75% Threshold Engine
- **Course Management:** Add, edit, and delete enrolled courses with course code, subject name, location, and class counters.
- **Quick Attendance Marking:** Rapid one-click *"Mark Today's Attendance"* modal to mark attendance (`PRESENT` or `ABSENT`) across all enrolled courses for any date.
- **Strict 75% Threshold Calculations:**
  - **Zero Division (`NaN%`) Guard:** If total classes are 0, status is cleanly set to `NO_DATA` with 0.0% attendance.
  - **Consecutive Recovery Calculation ($< 75\%$):**
    $$\text{classesNeeded} = \lceil 3 \cdot \text{totalClasses} - 4 \cdot \text{attendedClasses} \rceil$$
    *Alerts:* Low attendance warning with exact consecutive classes required to reach 75%.
  - **Safe Miss / Bunk Allowance ($\ge 75\%$):**
    $$\text{classesCanMiss} = \lfloor \frac{4 \cdot \text{attendedClasses} - 3 \cdot \text{totalClasses}}{3} \rfloor$$
    *Alerts:* Safe cushion showing how many upcoming classes can be missed while remaining $\ge 75\%$.
- **Instant Search & Filter:** Filter courses by `All`, `Safe` ($\ge 75\%$), or `Low` ($< 75\%$) with live code and name search.

### 2. 📂 Projects & Team Collaboration
- **Team Lead & Member Roles:** Create team projects, assign team leads, and enroll university peers.
- **Member Invitations:** Search through all 30 university students by name or roll number, send invitations, and track pending/accepted statuses.
- **Milestone & Subtask Workflow Gates:**
  - 🔒 **Rule 1 (Subtask Creation Gate):** Subtasks cannot be added for any member until an overall milestone and deadline are assigned.
  - 🔒 **Rule 2 (Task Submission Gate):** An overall milestone cannot be marked complete until **all** child subtasks are marked 100% complete.
  - 👤 **Individual Responsibility Isolation:** Each enrolled member is strictly responsible for submitting their own milestone via the *"Complete Task"* button. Team leads cannot submit or complete tasks on behalf of other members.
- **Real-Time Group Chat:** Embedded team discussion channel with instant message synchronization, user badges, and persistent chat history.
- **Project Lifecycle Management ("End Project"):** Team Leads can officially conclude a project with a reconfirmation safeguard. Ending a project locks active edits, marks status as `ENDED`, broadcasts project completion notifications, and displays a prominent "Project Finalized" banner.

### 3. 🔔 Real-Time Notifications Hub
- **Deadline Monitoring:** Automated background checks identify overdue member milestones and dispatch notification alerts.
- **Project Activity Feeds:** Alerts for incoming invitations, team membership acceptances, milestone assignments, and project completions.
- **Interactive Actions:** Direct Accept/Decline action buttons for project invitations and a one-click *"Mark all as read"* control.

### 4. 👤 Student Profile & Portfolio
- **Profile Customization:** Upload custom profile avatars with instant base64 encoding and preview.
- **Academic & Contact Details:** Edit semester (1 through 8), roll number, department/branch, bio, and technical skills.
- **Social & Professional Links:** Showcase GitHub repository links and LinkedIn profiles.
- **Dynamic Propagation:** Profile details and avatars automatically sync across team member cards, chat headers, and project rosters.

### 5. 🧭 Streamlined Navigation Menu
A minimalist, distraction-free 4-section sidebar layout:
1. **Attendance:** KPI metrics, 75% compliance tracker, and course cards.
2. **Projects:** Team projects, member cards, subtask drawers, group chat, and invitation management.
3. **Notifications:** Real-time alert list with unread counter badge.
4. **My Profile:** Academic portfolio, photo upload, and personal settings.

---

## 👥 Pre-Seeded Student Accounts

ScholarHub comes pre-configured with **30 official university student accounts** (`102403001` to `102403030`).

- **Default Password for All Accounts:** `password123`
- **Instant Demo Logins:** The login page features quick one-click shortcuts to test different roles:

| Roll Number | Student Name | Role in Demo | Department | Semester |
|---|---|---|---|---|
| `102403001` | **Aarav Sharma** | Team Lead | Computer Engineering | Sem 5 |
| `102403002` | **Ananya Verma** | Active Member | Computer Engineering | Sem 5 |
| `102403003` | **Rohan Mehta** | Active Member | Computer Science | Sem 5 |
| `102403004` | **Priya Nair** | Invited Member | Information Technology | Sem 5 |
| `102403005` - `102403030` | *26 Enrolled Students* | Available to Invite | Various Engineering Depts | Sem 1 - 8 |

---

## 🛠️ Architecture & Tech Stack

```
scholarhub/
├── backend/                  # Spring Boot 3 Application
│   ├── src/main/java/com/scholarhub/attendance/
│   │   ├── controller/      # REST API Controllers (Auth, Attendance, Projects, Notifications, Users)
│   │   ├── model/           # JPA Entities (Student, User, Subject, Project, ProjectMember, Subtask, Message, Notification)
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   ├── service/         # Business Logic & Validation Gates
│   │   └── config/          # Security, CORS, and DataSeeder Initializer
│   ├── Dockerfile           # Backend Container Build
│   └── pom.xml              # Maven Build Configuration
├── frontend/                 # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/      # UI Components (Sidebar, Header, Modals, Drawer, Chat, Cards)
│   │   ├── views/           # Core Views (AttendanceView, ProjectsView, NotificationsView, ProfileView)
│   │   ├── context/         # AuthContext & Session State
│   │   └── services/        # Axios API Client & Base Configuration
│   ├── tailwind.config.js   # Tailwind Theme & Styling
│   └── vite.config.js       # Vite Bundler Setup
├── Dockerfile                # Root Deployment Container for Render
└── README.md                 # Project Documentation
```

### Technology Highlights:
- **Backend:** Java 17+, Spring Boot 3.2.5, Spring Security (Bearer Token Auth), Spring Data JPA, Hibernate, Jakarta Validation.
- **Databases:** MySQL 8 (Production) / In-Memory H2 (Dev profile fallback).
- **Frontend:** React 18, Vite 5, Tailwind CSS 3, Lucide React, Axios.
- **DevOps:** Multi-stage Docker packaging, Vercel frontend edge hosting, Render backend deployment.

---

## 📡 Comprehensive REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate with roll number/email and password; returns token and user payload |
| `POST` | `/api/auth/register` | Register a new student account (roll number, email, branch, semester, password) |
| `GET` | `/api/auth/me` | Retrieve currently authenticated user session details |
| `POST` | `/api/auth/logout` | Invalidate current session token |

### 📅 Attendance & Subjects (`/api/attendance`, `/api/subjects`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/attendance/summary` | Overall KPI metrics + calculated subject statistics & 75% recommendations |
| `POST` | `/api/attendance/mark` | Transactionally marks attendance for multiple subjects on a given date |
| `GET` | `/api/subjects` | Retrieves all registered courses for the student |
| `POST` | `/api/subjects` | Creates a new course |
| `PUT` | `/api/subjects/{id}` | Updates course details or manual attended/total class counts |
| `DELETE` | `/api/subjects/{id}` | Deletes a course (cascades logs) |
| `PATCH` | `/api/subjects/{id}/increment` | Quick increment for attended (`PRESENT`) or missed (`ABSENT`) count |

### 📂 Projects & Collaboration (`/api/projects`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | List projects where user is creator or enrolled member |
| `POST` | `/api/projects` | Create a new project (caller becomes Team Lead) |
| `GET` | `/api/projects/{id}` | Fetch project details, members, tasks, and subtasks |
| `POST` | `/api/projects/{id}/invite` | Team Lead invites a student by roll number |
| `GET` | `/api/projects/invitations` | Get pending invitations for the current user |
| `POST` | `/api/projects/{id}/accept` | Accept an invitation to join the team |
| `POST` | `/api/projects/{id}/reject` | Decline an invitation to join the team |
| `POST` | `/api/projects/{id}/end` | Conclude and finalize the project (Team Lead only) |
| `PATCH` | `/api/projects/{id}/members/{mId}/task` | Assign or edit overall milestone and deadline |
| `PATCH` | `/api/projects/{id}/members/{mId}/task/complete` | Complete milestone (Member self-completion only; requires all subtasks done) |
| `POST` | `/api/projects/{id}/members/{mId}/subtasks` | Add a subtask (Requires assigned milestone) |
| `PATCH` | `/api/projects/{id}/members/{mId}/subtasks/{sId}/complete` | Toggle subtask completed status |
| `DELETE` | `/api/projects/{id}/members/{mId}/subtasks/{sId}` | Delete a subtask |
| `GET` | `/api/projects/{id}/messages` | Retrieve project group chat history |
| `POST` | `/api/projects/{id}/messages` | Post a new message in the project group chat |

### 🔔 Notifications (`/api/notifications`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notifications` | Fetch all notifications for the authenticated student |
| `GET` | `/api/notifications/unread-count` | Fetch the count of unread notifications |
| `PATCH` | `/api/notifications/{id}/read` | Mark an individual notification as read |
| `PATCH` | `/api/notifications/mark-all-read` | Mark all notifications as read |

### 👤 Profile & Users (`/api/users`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | List university students (used for member invitations) |
| `GET` | `/api/users/current` | Retrieve current student's full profile |
| `PUT` | `/api/users/profile` | Update profile photo, semester, roll number, department, bio, and skills |

---

## 🚀 Local Development Setup

### Prerequisites
- **Java Development Kit (JDK):** Version 17 or higher
- **Apache Maven:** Version 3.8+
- **Node.js:** Version 18+ & npm
- *(Optional)* **MySQL:** Version 8.0+ (If not using H2 dev profile)

### 1. Clone the Repository
```bash
git clone https://github.com/shresht-on-git/java_project_scholarhub.git
cd java_project_scholarhub
```

### 2. Start the Backend Service
```bash
cd backend

# Option A: In-Memory H2 Dev Profile (Zero setup required, seeds 30 students automatically)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Option B: Local MySQL Database
mvn spring-boot:run
```
- The backend starts at: `http://localhost:8080`
- Health probe check: `http://localhost:8080/api/health`

### 3. Start the Frontend Application
```bash
cd frontend

# Install dependencies
npm install

# Run the Vite development server
npm run dev
```
- Access the web application at: `http://localhost:5173`
- Click any **Instant Demo Login** button on the sign-in screen to begin.

---

## 🚢 Deployment Guide

### Deploying Backend to Render (Docker)
1. Fork or push this repository to GitHub.
2. In [Render](https://dashboard.render.com/), click **New +** $\rightarrow$ **Web Service**.
3. Connect your repository.
4. Set:
   - **Language:** `Docker`
   - **Region:** Any preferred region (e.g., Singapore, Oregon, Frankfurt)
   - **Branch:** `main`
5. Under **Environment Variables**, add:
   ```env
   SPRING_PROFILES_ACTIVE=dev
   PORT=8080
   ```
   *(Or configure your production MySQL connection variables: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`)*
6. Click **Deploy Web Service**.

### Deploying Frontend to Vercel
1. In [Vercel](https://vercel.com/), click **Add New** $\rightarrow$ **Project**.
2. Select your `java_project_scholarhub` repository.
3. Set **Root Directory** to `frontend`.
4. Under **Environment Variables**, set:
   ```env
   VITE_API_URL=https://<your-render-backend-url>.onrender.com
   ```
5. Click **Deploy**.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
