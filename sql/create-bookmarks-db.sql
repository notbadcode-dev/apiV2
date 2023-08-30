 -- Drop and create the database
DROP
    DATABASE IF EXISTS link;

CREATE DATABASE link;

USE link;

-- Create the group_link table
CREATE TABLE
    IF NOT EXISTS group_link (
        group_link_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(250) NOT NULL,
        color1 CHAR(9) NOT NULL DEFAULT '000000000',
        color2 CHAR(9) NOT NULL DEFAULT '000000000',
        gradient_type ENUM ('linear', 'radial', 'angular') NOT NULL DEFAULT 'linear',
        display_order INT NULL DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX ix_user_id (user_id),
        FOREIGN KEY fk_group_link_user_id (user_id) REFERENCES auth.user (user_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

USE link;

-- Create the link table
CREATE TABLE
    IF NOT EXISTS link (
        link_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        group_link_id INT NULL DEFAULT NULL,
        name VARCHAR(250) NOT NULL,
        url VARCHAR(2000) NOT NULL,
        favorite TINYINT NOT NULL DEFAULT 0,
        active TINYINT NOT NULL DEFAULT 1,
        display_order INT NULL DEFAULT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY (link_id, user_id),
        INDEX ix_user_id (user_id),
        INDEX ix_group_link_id (group_link_id),
        FOREIGN KEY fk_link_user_id (user_id) REFERENCES auth.user (user_id),
        FOREIGN KEY fk_link_group_link_id (group_link_id) REFERENCES group_link (group_link_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

USE link;

-- Create the tag table
CREATE TABLE
    IF NOT EXISTS tag (
        tag_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        link_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX ix_user_id (user_id),
        INDEX ix_link_id (link_id),
        FOREIGN KEY fk_tag_user_id (user_id) REFERENCES auth.user (user_id),
        FOREIGN KEY fk_tag_link_id (link_id) REFERENCES link (link_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
