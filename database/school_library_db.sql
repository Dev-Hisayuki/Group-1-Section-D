-- School Library Management System
-- Database: school_library_db
-- Corrected export for local development and group setup
-- MariaDB / MySQL

CREATE DATABASE IF NOT EXISTS `school_library_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `school_library_db`;

SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Table structure: branches
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `branches` (
  `branch_id` int(11) NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `contact_number` varchar(30) DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure: categories
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categories`
  (`category_id`, `category_name`, `description`, `status`, `created_at`, `updated_at`)
VALUES
  (1, 'Fiction', 'Novels and fictional stories', 'Active', '2026-10-18 23:25:53', '2026-10-18 23:25:53'),
  (2, 'Non-Fiction', 'Factual and informational books', 'Active', '2026-10-18 23:25:53', '2026-10-18 23:25:53'),
  (3, 'Science', 'Scientific topics and discoveries', 'Active', '2026-10-18 23:25:53', '2026-10-18 23:25:53'),
  (4, 'Technology', 'Computing and technical subjects', 'Active', '2026-10-18 23:25:53', '2026-10-18 23:25:53'),
  (5, 'History', 'Historical events and biographies', 'Active', '2026-10-18 23:25:53', '2026-10-18 23:25:53'),
  (7, 'Computer Studies', 'Books about computers and information technology', 'Active', '2026-10-19 00:17:38', '2026-10-19 00:17:38'),
  (8, 'Computer Networks', 'Books about computer networks', 'Active', '2026-10-19 00:18:47', '2026-10-19 00:18:47')
ON DUPLICATE KEY UPDATE
  `description` = VALUES(`description`),
  `status` = VALUES(`status`);

-- --------------------------------------------------------
-- Table structure: roles
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `roles` (`role_id`, `role_name`, `description`, `created_at`)
VALUES (1, 'Administrator', 'Manages the library system', '2026-10-19 00:31:50')
ON DUPLICATE KEY UPDATE
  `description` = VALUES(`description`);

-- --------------------------------------------------------
-- Table structure: sessions
-- Structure only; do not distribute active session data.
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure: users
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_users_roles` (`role_id`),
  CONSTRAINT `fk_users_roles` FOREIGN KEY (`role_id`)
    REFERENCES `roles` (`role_id`)
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Existing local administrator account.
-- Change its password before using the system beyond local development.

INSERT INTO `users`
  (`user_id`, `role_id`, `full_name`, `username`, `email`, `password_hash`, `status`, `created_at`, `updated_at`)
VALUES
  (1, 1, 'Library Administrator', 'libraryadmin', 'admin@example.com',
   '$2b$12$WVzx.DMdgNfZxEYTRGrQxuUBG8kyXYi1xUpxD9LstlvKmK99pkpdO',
   'Active', '2026-10-19 03:02:28', '2026-10-19 03:02:28')
ON DUPLICATE KEY UPDATE
  `role_id` = VALUES(`role_id`),
  `full_name` = VALUES(`full_name`),
  `status` = VALUES(`status`);

SET FOREIGN_KEY_CHECKS = 1;

-- End of database setup.