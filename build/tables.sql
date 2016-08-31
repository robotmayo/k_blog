DROP TABLE IF EXISTS `kblog_users`;
CREATE TABLE kblog_users(
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(30) NOT NULL,
  is_author BOOLEAN DEFAULT FALSE,
  password VARCHAR(60) NOT NULL,
  UNIQUE KEY `username`(`username`)
);

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE sessions(
  user_id INT,
  session_id VARCHAR(32) PRIMARY KEY NOT NULL,
  author BOOLEAN DEFAULT FALSE
);

DROP TABLE IF EXISTS `blog_posts`;
CREATE TABLE blog_posts(
  id INT AUTO_INCREMENT PRIMARY KEY,
  author_id INT,
  title VARCHAR(100),
  body TEXT,
  created DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS `post_comments`;
CREATE TABLE post_comments(
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  post_id INT,
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  body VARCHAR(500)
);
