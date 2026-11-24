# ScholarHub Deployment & Setup Guide

This guide provides end-to-end instructions for deploying the **ScholarHub Student Self-Management Web Application** (Spring Boot 3 + MySQL 8 + React Vite) with zero code changes.

---

## 1. Database Setup (MySQL 8)

You can use a local MySQL 8 instance or any managed cloud database provider (e.g., **Aiven**, **Railway**, **PlanetScale**, **AWS RDS**).

### Option A: Local MySQL 8
1. Start MySQL server.
2. Connect to MySQL client:
   ```bash
   mysql -u root -p
   ```
3. Execute the provided schema file `backend/src/main/resources/schema.sql`:
   ```sql
   CREATE DATABASE IF NOT EXISTS scholarhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
   *(Note: Hibernate with `spring.jpa.hibernate.ddl-auto=update` will also automatically generate and update all tables on application startup).*

### Option B: Cloud MySQL (Aiven / Railway)
1. Create a MySQL 8 service in [Aiven](https://aiven.io/) or [Railway](https://railway.app/).
2. Copy the Connection URI, Host, Port, Database Name, Username, and Password.

---

## 2. Backend Deployment (Render / Railway)

The backend includes a production-ready, multi-stage Dockerfile (`backend/Dockerfile`) that compiles the application using `maven:3.9-eclipse-temurin-17` and runs it with a secure, lightweight `eclipse-temurin:17-jre-alpine` runtime.

### Option A: Deploy on Render
1. Push your repository to GitHub.
2. In Render, select **New +** -> **Web Service**.
3. Connect your repository.
4. Set **Root Directory** to `backend`.
5. Select **Docker** as the environment (Render detects `backend/Dockerfile` automatically).
6. Configure the following **Environment Variables**:

| Variable | Description | Example / Recommended Value |
|---|---|---|
| `PORT` | HTTP port exposed by server | `8080` (or leave default assigned by Render) |
| `DB_URL` | MySQL JDBC Connection URL | `jdbc:mysql://<db-host>:<port>/scholarhub?useSSL=true&allowPublicKeyRetrieval=true` |
| `DB_USERNAME` | Database username | `avnadmin` or `root` |
| `DB_PASSWORD` | Database password | `<your-database-password>` |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `https://scholarhub.vercel.app` (supports comma-separated list) |

7. **Health Check Path**: `/api/health`
8. Click **Deploy Web Service**.

### Option B: Deploy on Railway
1. In Railway, click **New Project** -> **Deploy from GitHub repo**.
2. Set Root Directory to `backend`.
3. Set the Environment Variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `FRONTEND_URL`, `PORT`).
4. Railway will automatically build the multi-stage Dockerfile and expose the public URL.

---

## 3. Frontend Deployment (Vercel / Netlify)

The frontend includes `frontend/vercel.json` with SPA route rewrites to ensure page refreshes never throw 404s.

### Deploy on Vercel
1. In Vercel, click **Add New...** -> **Project**.
2. Import your GitHub repository.
3. Configure the Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the **Environment Variable**:

| Variable | Description | Example Value |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of deployed Spring Boot backend | `https://scholarhub-backend.onrender.com` |

5. Click **Deploy**.
6. Once deployed, copy your Vercel production domain (e.g., `https://scholarhub.vercel.app`) and update the `FRONTEND_URL` environment variable on your Render/Railway backend so CORS allows requests.

---

## 4. Local Development Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.8+ (or use installed Maven)
- Node.js 18+ and npm 9+
- MySQL 8 (optional: Spring Boot also supports H2 in-memory via `-Dspring.profiles.active=dev` if MySQL is not running)

### Run Backend
```bash
cd backend

# Standard run with MySQL:
mvn spring-boot:run

# Or run with custom database credentials:
mvn spring-boot:run -Dspring-boot.run.arguments="--DB_URL=jdbc:mysql://localhost:3306/scholarhub?createDatabaseIfNotExist=true&useSSL=false --DB_USERNAME=root --DB_PASSWORD=root"

# Or run with dev profile (in-memory H2 database with auto-seeded demo records):
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
Backend runs on: `http://localhost:8080`
Cloud Health check: `http://localhost:8080/api/health`

### Run Frontend
```bash
cd frontend

# Install dependencies:
npm install

# Start Vite dev server:
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 5. Summary of Architecture & Formulas

- **Zero Total Classes Protection**: If `totalClasses == 0`, percentage is strictly `0.0%` with status `"NO_DATA"` and message `"No classes recorded yet."` Never throws NaN% or ArithmeticException.
- **Low Attendance Threshold (< 75%)**:
  $$\text{classesNeeded} = \lceil 3 \times \text{totalClasses} - 4 \times \text{attendedClasses} \rceil$$
- **Safe Attendance Threshold ($\ge 75\%$)**:
  $$\text{classesCanMiss} = \lfloor \frac{4 \times \text{attendedClasses} - 3 \times \text{totalClasses}}{3} \rfloor$$
