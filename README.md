# Personal Finance Tracker

A full-stack Personal Finance Tracker application with a **Spring Boot** backend and a **React (Vite)** frontend.

## Tech Stack
- **Backend:** Spring Boot (Java 17), Spring Security, Spring Data JPA, JWT Authentication
- **Frontend:** React, Vite, Vanilla CSS
- **Database:** PostgreSQL (with Docker Compose support)
- **Reporting:** OpenPDF (PDF Generation) & Custom CSV Builder

## Project Structure
- `backend/` - Spring Boot backend
- `frontend/` - React frontend
- `docker-compose.yml` - Docker compose file for PostgreSQL and pgAdmin

## How to Run

### Database
1. Run `docker-compose up -d` in the root directory to spin up PostgreSQL and pgAdmin.
2. PostgreSQL will run on port `5432` (database `financetracker`, user `postgres`, password `postgrespassword`).
3. pgAdmin will run on port `5050` (credentials: `admin@finance.com` / `adminpassword`).

### Backend
1. Navigate to the `backend/` directory: `cd backend`
2. Build the project using Maven: `mvn clean install`
3. Run the application: `mvn spring-boot:run`
4. The backend API will be available at `http://localhost:8080`.

### Frontend
1. Navigate to the `frontend/` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. The frontend will be available at `http://localhost:5173`.