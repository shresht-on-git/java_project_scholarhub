# ScholarHub - Student Academic Self-Management & Attendance Tracker

ScholarHub is a modern, full-stack academic dashboard built for university students to track lecture attendance, monitor strict 75% attendance thresholds, plan safe absences, and calculate consecutive attendances required to reach eligibility.

---

## 🌟 Key Features

1. **Subject Management:**
   - Add, edit, and delete enrolled courses (`courseCode`, `subjectName`, `location`).
   - Dynamic tracking of attended, missed, and total classes held.
   - Manual override flexibility while guaranteeing `totalClasses >= attendedClasses`.

2. **Quick Attendance Marking:**
   - **"Mark Today's Attendance"** modal allows rapid one-click marking across all courses for the current day or past lecture dates.
   - Transactional logging in `attendance_logs` table (`PRESENT` or `ABSENT`).

3. **Intelligent 75% Threshold Engine & Zero `NaN%` Protection:**
   - **Division by Zero Guard:** If a subject has 0 total classes, status is cleanly set to `"NO_DATA"` with `0.0%` attendance and `"No classes recorded yet."` banner.
   - **Consecutive Recovery Calculation (< 75%):**
     $$\text{classesNeeded} = \lceil 3 \cdot \text{totalClasses} - 4 \cdot \text{attendedClasses} \rceil$$
     Alerts: *"Attendance is low! Must attend next X consecutive classes to reach 75%."*
   - **Safe Miss / Bunk Allowance ($\ge$ 75%):**
     $$\text{classesCanMiss} = \lfloor \frac{4 \cdot \text{attendedClasses} - 3 \cdot \text{totalClasses}}{3} \rfloor$$
     Alerts: *"On track! You can safely skip up to Y classes and stay above 75%."*

4. **Sleek Academic SaaS Dashboard:**
   - Clean light SaaS theme (`#F8FAFC` background, rounded white cards, crisp typography, and semantic badge indicators).
   - Real-time overall attendance KPI cards + course search and status filter tabs.
   - Single-click increment buttons (`+` for attended and missed) directly on subject cards.

---

## 🛠️ Tech Stack

- **Backend:** Java 17+ (JDK 25 compatible), Spring Boot 3.2.5 (Spring Web, Spring Data JPA, Spring Validation, MySQL Connector, H2 Fallback).
- **Database:** MySQL 8 (`schema.sql` included, `spring.jpa.hibernate.ddl-auto=update`).
- **Frontend:** React 18, Vite, Tailwind CSS 3, Lucide React icons, Axios.
- **Docker:** Multi-stage Docker build for cloud deployments (Render, Railway, Fly.io).

---

## 🚀 Quick Start

### 1. Start the Spring Boot Backend

```bash
cd backend

# Option A: Run with local MySQL (Default)
mvn spring-boot:run

# Option B: Run with Dev Profile (In-Memory H2 with pre-seeded demo subjects)
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
- API Base: `http://localhost:8080`
- Health Check: `http://localhost:8080/api/health`

### 2. Start the React Frontend

```bash
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/attendance/summary` | Overall KPI metrics + calculated subject statistics & threshold recommendations |
| `POST` | `/api/attendance/mark` | Transactionally bulk marks today's attendance for enrolled courses |
| `GET` | `/api/subjects` | Retrieves all registered courses |
| `POST` | `/api/subjects` | Creates a new course |
| `PUT` | `/api/subjects/{id}` | Updates course information or manual counts |
| `DELETE` | `/api/subjects/{id}` | Deletes a course (cascades logs) |
| `PATCH` | `/api/subjects/{id}/increment` | Quick increment for attended (`PRESENT`) or missed (`ABSENT`) |
| `GET` | `/api/health` | Lightweight service health probe (`{"status": "UP"}`) |

---

## 🚢 Deployment

See [DEPLOYMENT.md](file:///c:/Users/ASUS/Desktop/java_project_scholar/DEPLOYMENT.md) for step-by-step instructions on deploying the database to Aiven/Railway, backend to Render/Railway Docker, and frontend to Vercel/Netlify.
