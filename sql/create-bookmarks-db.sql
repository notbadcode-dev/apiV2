DROP
    DATABASE IF EXISTS link;

CREATE DATABASE link;

USE link;

CREATE TABLE
    IF NOT EXISTS link (
        link_id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(250) NOT NULL,
        url VARCHAR(250) NOT NULL,
        favorite TINYINT NOT NULL DEFAULT 0,
        active TINYINT NOT NULL DEFAULT 1,
        user_id INT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (link_id),
        FOREIGN KEY (user_id) REFERENCES auth.user (user_id) ON DELETE CASCADE,
        INDEX ix_user_id (user_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

USE link;

CREATE TABLE
    IF NOT EXISTS link_group (
        link_group_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(250) NOT NULL,
        color1 CHAR(9) NOT NULL,
        color2 CHAR(9) NOT NULL,
        gradient_type ENUM ('linear', 'radial', 'angular') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX ix_user_id (user_id),
        FOREIGN KEY (user_id) REFERENCES auth.user (user_id)
    );

USE link;

CREATE TABLE
    IF NOT EXISTS link_group_relation (
        link_group_relation_id INT AUTO_INCREMENT PRIMARY KEY,
        order_index INT NOT NULL,
        user_id INT NOT NULL,
        link_id INT NOT NULL,
        group_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_link_group (user_id, link_id, group_id),
        KEY ix_user_id_order_index (user_id, order_index),
        CONSTRAINT fk_link_group_relation_user_id FOREIGN KEY (user_id) REFERENCES auth.user (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_link_group_relation_link_id FOREIGN KEY (link_id) REFERENCES link (link_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_link_group_relation_group_id FOREIGN KEY (group_id) REFERENCES link_group (link_group_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

USE link;

CREATE TABLE
    IF NOT EXISTS link_order (
        link_order_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        link_id INT NOT NULL,
        group_id INT,
        order_index INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_link_order_user_id FOREIGN KEY (user_id) REFERENCES auth.user (user_id),
        CONSTRAINT fk_link_order_link_id FOREIGN KEY (link_id) REFERENCES link (link_id),
        CONSTRAINT fk_link_order_group_id FOREIGN KEY (group_id) REFERENCES link_group_relation (link_group_relation_id),
        UNIQUE (user_id, link_id),
        INDEX ix_user_id_order_index (user_id, order_index)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

USE link;

CREATE TABLE
    IF NOT EXISTS tag (
        tag_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(250) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX ix_tag_id_user_id (tag_id, user_id),
        FOREIGN KEY (user_id) REFERENCES auth.user (user_id)
    );

USE link;

CREATE TABLE
    IF NOT EXISTS link_tag (
        link_tag_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        link_id INT NOT NULL,
        tag_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_link_tag (user_id, link_id, tag_id),
        INDEX ix_user_id_tag_id (user_id, tag_id),
        FOREIGN KEY (user_id) REFERENCES auth.user (user_id),
        FOREIGN KEY (link_id) REFERENCES link (link_id),
        FOREIGN KEY (tag_id) REFERENCES tag (tag_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

USE link;

CREATE TABLE
    IF NOT EXISTS tag (
        tag_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(250) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX ix_tag_id_user_id (tag_id, user_id),
        FOREIGN KEY (user_id) REFERENCES auth.user (user_id)
    );

USE link;

CREATE TABLE
    IF NOT EXISTS group_tag (
        group_tag_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        group_id INT NOT NULL,
        tag_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE (user_id, group_id, tag_id),
        INDEX ix_user_id (user_id),
        FOREIGN KEY (user_id) REFERENCES auth.user (user_id),
        FOREIGN KEY (group_id) REFERENCES link_group_relation (link_group_relation_id),
        FOREIGN KEY (tag_id) REFERENCES tag (tag_id)
    );
