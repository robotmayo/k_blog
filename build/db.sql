-- CREATE DATABASE k_blog;
-- USE DATABASE  k_blog;

DROP TABLE IF EXISTS `users`;
CREATE TABLE kblog_users(
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(30) NOT NULL,
  is_author BOOLEAN DEFAULT FALSE NOT NULL,
  password VARCHAR(60) NOT NULL,
  UNIQUE KEY `username`(`username`)
);

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE sessions(
  user_id INT,
  session_id VARCHAR(32) PRIMARY KEY NOT NULL,
  author BOOLEAN DEFAULT FALSE
);
