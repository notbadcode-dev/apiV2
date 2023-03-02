CREATE DATABASE bookmarks;

USE bookmarks;

CREATE TABLE
    link (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES auth.user (id)
    );

CREATE TABLE
    group_folder (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        color VARCHAR(9) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES auth.user (id)
    );

CREATE TABLE
    link_group (
        id INT AUTO_INCREMENT PRIMARY KEY,
        link_id INT NOT NULL,
        group_folder_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (link_id) REFERENCES links (id),
        FOREIGN KEY (group_folder_id) REFERENCES group_folder (id)
    );

CREATE TABLE
    tag (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );

CREATE TABLE
    link_tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        link_id INT NOT NULL,
        tag_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (link_id) REFERENCES link (id),
        FOREIGN KEY (tag_id) REFERENCES tag (id),
        UNIQUE (link_id, tag_id)
    );

CREATE TABLE
    folder_tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        folder_id INT NOT NULL,
        tag_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (folder_id) REFERENCES group_folder (id),
        FOREIGN KEY (tag_id) REFERENCES tag (id),
        UNIQUE (folder_id, tag_id)
    );
