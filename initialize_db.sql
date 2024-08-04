CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(50) NOT NULL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_config (
    user_id VARCHAR(50) NOT NULL,
    work_time INT DEFAULT 25,
    relax_time INT DEFAULT 5,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS user_stats (
    user_id VARCHAR(50) NOT NULL,
    minutes INT DEFAULT 0,
    pomodoro_tot INT DEFAULT 0,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS user_tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50),
    task VARCHAR(255),
    task_done TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE topics (
    topic_id INT AUTO_INCREMENT PRIMARY KEY,
    topic_name VARCHAR(255) NOT NULL,
    user_id VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE 
);

CREATE TABLE cards (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id INT,
    user_id VARCHAR(50),
    question VARCHAR(255) NOT NULL,
    answer VARCHAR(255) NOT NULL,
    last_review TIMESTAMP DEFAULT NULL,
    next_review TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    interval INT DEFAULT 1,  -- Intervalo en días
    ease FLOAT DEFAULT 2.5,  -- Factor de facilidad
    FOREIGN KEY (topic_id) REFERENCES topics(topic_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

DELIMITER //

CREATE PROCEDURE `create_new_user`(
    IN p_user_id VARCHAR(50)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) THEN
        INSERT INTO users (user_id) VALUES (p_user_id);
        INSERT INTO user_stats (user_id) VALUES (p_user_id);
        INSERT INTO user_config (user_id) VALUES (p_user_id);
    END IF;
END //

DELIMITER ;
