# MySQL Database Setup & Configuration Guide

This project supports dual database execution:
1. **H2 Database (Default)**: Embedded, persistent or in-memory, zero-setup H2 database with Web Console (`http://localhost:8081/h2-console`).
2. **MySQL Database (Optional / Production Showcase)**: Production-ready MySQL database connection via dedicated profile `mysql`.

---

## 📁 MySQL Files Created

| File Path | Description |
| :--- | :--- |
| [application-mysql.properties](file:///d:/My%20Projects/ILP/fs/finance-tracker/backend/src/main/resources/application-mysql.properties) | Dedicated Spring Boot MySQL configuration file. |
| [schema-mysql.sql](file:///d:/My%20Projects/ILP/fs/finance-tracker/backend/src/main/resources/schema-mysql.sql) | DDL SQL script to create tables (`users`, `incomes`, `expenses`, `budgets`, `savings_goals`). |

---

## 🛠️ Step-by-Step MySQL Setup Instructions

### Step 1: Create Database in MySQL
Open MySQL Command Line Client or MySQL Workbench and run:

```sql
CREATE DATABASE finance_tracker_db;
```

---

### Step 2: Configure MySQL Credentials
Open [application-mysql.properties](file:///d:/My%20Projects/ILP/fs/finance-tracker/backend/src/main/resources/application-mysql.properties) and update username/password to match your local MySQL installation:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/finance_tracker_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

### Step 3: Launch Application with MySQL Profile

#### Option A: Command Line (Maven)
Run the Spring Boot application specifying the `mysql` profile:

```bash
mvn -f backend/pom.xml spring-boot:run -Dspring-boot.run.profiles=mysql
```

#### Option B: Enable MySQL in `application.properties`
Add or uncomment the following line in [application.properties](file:///d:/My%20Projects/ILP/fs/finance-tracker/backend/src/main/resources/application.properties):

```properties
spring.profiles.active=mysql
```

---

## 📊 Database Schema Details

The application automatically creates or updates the following tables on startup via JPA Hibernate (`spring.jpa.hibernate.ddl-auto=update`):

1. **`users`**: User profile credentials (id, username, email, password).
2. **`incomes`**: Income transactions (id, user_id, title, amount, date, category).
3. **`expenses`**: Expense transactions (id, user_id, title, amount, date, category).
4. **`budgets`**: Monthly budget targets and manual spent overrides (id, user_id, category, limit_amount, spent_amount, month_year).
5. **`savings_goals`**: Savings target milestones (id, user_id, title, target_amount, current_amount, target_date).
