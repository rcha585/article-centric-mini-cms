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
    username VARCHAR(100) NOT NULL,
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

-- USERS
INSERT INTO users (id, username, password, first_name, last_name, date_of_birth, description, is_admin, avatar_path) VALUES
(1, 'alice01', 'pass123', 'Alice', 'Johnson', '1990-04-23', 'Tech enthusiast.', 0, 'avatars/alice.jpg'),
(2, 'bobsmith', 'bobpass', 'Bob', 'Smith', '1985-12-11', 'Writer and blogger.', 0, 'avatars/bob.jpg'),
(3, 'carla_dev', 'carlapw', 'Carla', 'Mendes', '1993-07-05', 'Full-stack developer.', 0, 'avatars/carla.png'),
(4, 'derek_l', 'derekpw', 'Derek', 'Lee', '1988-03-15', 'Photographer.', 0, 'avatars/derek.png'),
(5, 'emilyC', 'emilypass', 'Emily', 'Clark', '1995-10-01', 'Nature lover.', 0, 'avatars/emily.jpg'),
(6, 'felix_the_cat', 'felixtop', 'Felix', 'Khan', '1991-06-21', 'Just a regular user.', 0, 'avatars/felix.png'),
(7, 'grace_b', 'gracepw', 'Grace', 'Bell', '1982-01-30', 'Travel blogger.', 0, 'avatars/grace.jpg'),
(8, 'harryPotts', 'harry123', 'Harry', 'Potts', '1996-09-10', 'Student of history.', 0, 'avatars/harry.jpg'),
(9, 'isla_m', 'islapw', 'Isla', 'Morrison', '1989-08-18', 'Book reviewer.', 0, 'avatars/isla.jpg'),
(10, 'jackie_chan', 'kickpass', 'Jackie', 'Chan', '1974-04-07', 'Martial arts lover.', 0, 'avatars/jackie.jpg');

-- TAGS
INSERT INTO tags (id, content) VALUES
(1, 'Technology'),
(2, 'Science'),
(3, 'Travel'),
(4, 'Food'),
(5, 'Programming'),
(6, 'Lifestyle'),
(7, 'Photography'),
(8, 'Books'),
(9, 'History'),
(10, 'Fitness');

-- ARTICLES
INSERT INTO articles (id, title, content, created_at, image_path, author_id) VALUES
(1, 'Top 10 JavaScript Tips', 'Useful JS tricks and best practices...', '2025-05-01 12:00:00', 'images/js.png', 3),
(2, 'Exploring Iceland', 'Traveling through Iceland is magical...', '2025-05-02 09:30:00', 'images/iceland.jpg', 7),
(3, 'Healthy Smoothie Recipes', 'Try these delicious smoothies...', '2025-05-03 10:00:00', 'images/smoothie.jpg', 5),
(4, 'History of Rome', 'A deep dive into ancient Rome...', '2025-05-04 14:20:00', 'images/rome.jpg', 9),
(5, 'AI Trends in 2025', 'The future of artificial intelligence...', '2025-05-05 16:45:00', 'images/ai.jpg', 1),
(6, 'Street Photography Tips', 'Capture city life like a pro...', '2025-05-06 18:00:00', 'images/street.jpg', 4),
(7, 'Best Coding Practices', 'Write cleaner, better code...', '2025-05-07 11:00:00', 'images/code.jpg', 3),
(8, 'Mediterranean Diet', 'Why this diet is great...', '2025-05-08 09:15:00', 'images/diet.jpg', 5),
(9, 'Top Travel Apps', 'Apps to make travel easier...', '2025-05-09 13:30:00', 'images/apps.jpg', 2),
(10, 'Space Discoveries', 'Recent discoveries in space...', '2025-05-10 17:00:00', 'images/space.jpg', 2);

-- COMMENTS
INSERT INTO comments (id, content, created_at, article_id, user_id) VALUES
(1, 'Great tips!', '2025-05-01 13:00:00', 1, 2),
(2, 'I want to go to Iceland now!', '2025-05-02 10:00:00', 2, 6),
(3, 'Yum, I love smoothies!', '2025-05-03 10:30:00', 3, 1),
(4, 'Very informative.', '2025-05-04 15:00:00', 4, 10),
(5, 'AI is changing everything.', '2025-05-05 17:00:00', 5, 8),
(6, 'Nice photography tips!', '2025-05-06 19:00:00', 6, 7),
(7, 'This helped me write better code.', '2025-05-07 12:00:00', 7, 5),
(8, 'I follow this diet too.', '2025-05-08 09:45:00', 8, 6),
(9, 'These apps are so useful!', '2025-05-09 14:00:00', 9, 4),
(10, 'Space is fascinating!', '2025-05-10 18:00:00', 10, 9);

-- NOTIFICATIONS (article_id or comment_id is NULL)
INSERT INTO notifications (id, created_at, is_viewed, user_id, article_id, comment_id) VALUES
(1, '2025-05-01 13:01:00', 0, 1, 1, NULL),
(2, '2025-05-02 10:01:00', 0, 6, NULL, 2),
(3, '2025-05-03 10:31:00', 0, 1, 3, NULL),
(4, '2025-05-04 15:01:00', 1, 10, NULL, 4),
(5, '2025-05-05 17:01:00', 0, 8, 5, NULL),
(6, '2025-05-06 19:01:00', 0, 7, NULL, 6),
(7, '2025-05-07 12:01:00', 1, 5, 7, NULL),
(8, '2025-05-08 09:46:00', 0, 6, NULL, 8),
(9, '2025-05-09 14:01:00', 1, 4, 9, NULL),
(10, '2025-05-10 18:01:00', 0, 9, NULL, 10);

-- SUBSCRIPTIONS
INSERT INTO subscriptions (subscriber_user_id, subscribed_user_id) VALUES
(1, 2),
(1, 3),
(2, 3),
(2, 4),
(3, 5),
(4, 1),
(5, 6),
(6, 1),
(7, 8),
(8, 9),
(9, 10);

-- TAGGINGS
INSERT INTO taggings (article_id, tag_id) VALUES
(1, 5),
(1, 1),
(2, 3),
(3, 4),
(4, 9),
(5, 1),
(5, 2),
(6, 7),
(7, 5),
(8, 4),
(9, 3),
(10, 2);

-- LIKES
INSERT INTO likes (user_id, article_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(1, 5),
(2, 7),
(3, 9);