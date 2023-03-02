DROP
    DATABASE IF EXISTS auth;

CREATE DATABASE auth;

USE auth;

CREATE TABLE
    user (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(250) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    application (
        application_id INT AUTO_INCREMENT PRIMARY KEY,
        application_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    user_application (
        user_application_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        application_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        lastAccessed_at TIMESTAMP,
        deactivated_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user (user_id),
        FOREIGN KEY (application_id) REFERENCES application (application_id),
        UNIQUE (user_id, application_id)
    );
