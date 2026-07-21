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

## How to Run

### Database
The application is configured to use an in-memory **H2 database** for zero-setup execution. You do not need to install or run any local database servers (like MySQL or PostgreSQL). The database will automatically initialize when you start the backend.


### Unified Run (Single Port 8081)
You can run the entire application (both frontend and backend) on a single port (`8081`) with a single command:

#### Option A: On Windows (Batch script)
Simply double-click the `run.bat` file in the project root, or run it in your terminal:
```cmd
run.bat
```

#### Option B: Via npm (Cross-platform)
Run the following in the root folder:
```bash
npm run build-and-run
```

This command will automatically build the React frontend, place it inside the Spring Boot static resources, and start the backend. Your app will be fully available at **`http://localhost:8081`**.