-- MySQL Schema Script for Personal Finance Tracker

CREATE DATABASE IF NOT EXISTS `finance_tracker_db`;
USE `finance_tracker_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Incomes Table
CREATE TABLE IF NOT EXISTS `incomes` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `date` DATE NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  CONSTRAINT `fk_incomes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Expenses Table
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `date` DATE NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  CONSTRAINT `fk_expenses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Budgets Table (Supports category, limit amount, and spent amount)
CREATE TABLE IF NOT EXISTS `budgets` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `limit_amount` DECIMAL(15, 2) NOT NULL,
  `spent_amount` DECIMAL(15, 2) DEFAULT NULL,
  `month_year` VARCHAR(10) NOT NULL,
  CONSTRAINT `fk_budgets_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `uk_user_category_month` UNIQUE (`user_id`, `category`, `month_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Savings Goals Table
CREATE TABLE IF NOT EXISTS `savings_goals` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `target_amount` DECIMAL(15, 2) NOT NULL,
  `current_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `target_date` DATE NOT NULL,
  CONSTRAINT `fk_savings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
