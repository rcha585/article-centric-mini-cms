DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS taggings;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth TEXT NOT NULL,
    description VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    avatar_path VARCHAR(255) NOT NULL
);

CREATE TABLE tags (
    id INTEGER PRIMARY KEY,
    content VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE articles (
    id INTEGER PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    image_path VARCHAR(100) NOT NULL,
    author_id INTEGER NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id INTEGER PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    article_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id INTEGER PRIMARY KEY,
    created_at TEXT NOT NULL,
    is_viewed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id INTEGER NOT NULL,
    article_id INTEGER,
    comment_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE TABLE subscriptions (
    subscriber_user_id INTEGER NOT NULL,
    subscribed_user_id INTEGER NOT NULL,
    PRIMARY KEY (subscriber_user_id, subscribed_user_id),
    FOREIGN KEY (subscriber_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscribed_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE taggings (
    article_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE likes (
    user_id INTEGER NOT NULL,
    article_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, article_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

-- Insert users
INSERT INTO users (username, password, first_name, last_name, date_of_birth, description, is_admin, avatar_path) VALUES
('alice', 'password123', 'Alice', 'Smith', '1990-04-15', 'Enthusiastic writer and reader.', 0, '/avatars/alice.png'),
('bob', 'securepass', 'Bob', 'Johnson', '1985-09-30', 'Loves technology and blogging.', 0, '/avatars/bob.png'),
('carol', 'carolpass', 'Carol', 'Williams', '1992-12-20', 'Editor and content curator.', 1, '/avatars/carol.png');

-- Insert tags
INSERT INTO tags (content) VALUES
('Technology'),
('Lifestyle'),
('Education');

-- Insert articles
INSERT INTO articles (title, content, created_at, image_path, author_id) VALUES
('The Future of AI', 'Artificial intelligence is transforming the world...', '2025-06-01 10:00:00', '/images/ai.jpg', 1),
('Healthy Living Tips', 'Maintaining a balanced diet is crucial...', '2025-06-02 12:30:00', '/images/health.jpg', 2),
('Online Learning Platforms', 'E-learning has become more accessible...', '2025-06-03 09:15:00', '/images/elearning.jpg', 3);

-- Insert taggings (linking articles and tags)
INSERT INTO taggings (article_id, tag_id) VALUES
(1, 1), -- The Future of AI -> Technology
(2, 2), -- Healthy Living Tips -> Lifestyle
(3, 3); -- Online Learning Platforms -> Education

-- Insert comments (in English)
INSERT INTO comments (content, created_at, article_id, user_id) VALUES
('Great insights on AI, very informative!', '2025-06-01 11:00:00', 1, 2),
('I found these healthy tips very useful, thanks!', '2025-06-02 13:00:00', 2, 1),
('Online learning has really changed education for the better.', '2025-06-03 10:00:00', 3, 2);

-- Insert notifications
INSERT INTO notifications (created_at, is_viewed, user_id, article_id, comment_id) VALUES
('2025-06-01 11:05:00', 0, 1, 1, 1),
('2025-06-02 13:05:00', 0, 2, 2, 2),
('2025-06-03 10:05:00', 0, 3, 3, 3);

-- Insert subscriptions
INSERT INTO subscriptions (subscriber_user_id, subscribed_user_id) VALUES
(2, 1), -- Bob subscribes to Alice
(3, 2), -- Carol subscribes to Bob
(1, 3); -- Alice subscribes to Carol

-- Insert likes
INSERT INTO likes (user_id, article_id) VALUES
(1, 1),
(2, 1),
(2, 2),
(3, 3);