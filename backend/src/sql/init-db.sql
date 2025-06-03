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

-- USERS
INSERT INTO users (id, username, password, first_name, last_name, date_of_birth, description, is_admin, avatar_path) VALUES
(1, 'alice',  '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Alice', 'Wong',    '1990-03-15', 'Tech enthusiast.', FALSE, '/avatars/alice.png'),
(2, 'bob',    '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Bob',   'Smith',   '1985-07-22', 'Travel blogger.', FALSE, '/avatars/bob.png'),
(3, 'carol',  '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Carol', 'Johnson', '1992-12-01', 'Lifestyle writer.', TRUE,  '/avatars/carol.png'),
(4, 'dave',   '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Dave',  'Lee',     '1988-11-11', 'Photographer.', FALSE, '/avatars/dave.png'),
(5, 'eva',    '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Eva',   'Brown',   '1995-05-30', 'Food reviewer.', FALSE, '/avatars/eva.png'),
(6, 'frank',  '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Frank', 'Green',   '1983-04-18', 'History geek.', FALSE, '/avatars/frank.png'),
(7, 'grace',  '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Grace', 'Kim',     '1990-09-23', 'Science lover.', FALSE, '/avatars/grace.png'),
(8, 'henry',  '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Henry', 'Moore',   '1987-06-07', 'Freelance coder.', FALSE, '/avatars/henry.png'),
(9, 'irene',  '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Irene', 'Zhang',   '1993-02-14', 'Nature blogger.', FALSE, '/avatars/irene.png'),
(10, 'jack',  '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Jack',  'White',   '1991-08-19', 'Fitness coach.', FALSE, '/avatars/jack.png');

-- TAGS
INSERT INTO tags (id, content) VALUES
(1, 'Technology'),
(2, 'Travel'),
(3, 'Food'),
(4, 'Lifestyle'),
(5, 'Fitness'),
(6, 'Photography'),
(7, 'Programming'),
(8, 'History'),
(9, 'Science'),
(10, 'Nature');

-- ARTICLES
INSERT INTO articles (id, title, content, created_at, image_path, author_id) VALUES
(1, 'Intro to SQLite', 'Content A', '2024-01-01', '/images/a1.png', 1),
(2, 'Top 10 Travel Tips', 'Content B', '2024-01-02', '/images/a2.png', 2),
(3, 'Homemade Bread Guide', 'Content C', '2024-01-03', '/images/a3.png', 5),
(4, 'Daily Workout Plan', 'Content D', '2024-01-04', '/images/a4.png', 10),
(5, 'iPhone Photography Tips', 'Content E', '2024-01-05', '/images/a5.png', 4),
(6, 'Machine Learning 101', 'Content F', '2024-01-06', '/images/a6.png', 7),
(7, 'Cooking Thai Curry', 'Content G', '2024-01-07', '/images/a7.png', 5),
(8, 'Backpacking in Asia', 'Content H', '2024-01-08', '/images/a8.png', 2),
(9, 'Time Management Hacks', 'Content I', '2024-01-09', '/images/a9.png', 3),
(10, 'Running for Beginners', 'Content J', '2024-01-10', '/images/a10.png', 10),
(11, 'Tech Trends 2025', 'Content K', '2024-01-11', '/images/a11.png', 1),
(12, 'Photoshop for Beginners', 'Content L', '2024-01-12', '/images/a12.png', 4),
(13, 'Coding with Python', 'Content M', '2024-01-13', '/images/a13.png', 8),
(14, 'Keto Diet Explained', 'Content N', '2024-01-14', '/images/a14.png', 5),
(15, 'Digital Nomad Life', 'Content O', '2024-01-15', '/images/a15.png', 2),
(16, 'Eco-Friendly Living', 'Content P', '2024-01-16', '/images/a16.png', 9),
(17, 'Ancient Roman History', 'Content Q', '2024-01-17', '/images/a17.png', 6),
(18, 'Photography Lighting', 'Content R', '2024-01-18', '/images/a18.png', 4),
(19, 'Basics of JavaScript', 'Content S', '2024-01-19', '/images/a19.png', 8),
(20, 'Urban Gardening Tips', 'Content T', '2024-01-20', '/images/a20.png', 9);

-- TAGGINGS (Assign each article 1–3 tags)
INSERT INTO taggings (article_id, tag_id) VALUES
(1, 1), (1, 7),
(2, 2),
(3, 3),
(4, 5),
(5, 6),
(6, 1), (6, 9),
(7, 3),
(8, 2),
(9, 4),
(10, 5),
(11, 1),
(12, 6),
(13, 1), (13, 7),
(14, 3), (14, 4),
(15, 2), (15, 4),
(16, 4), (16, 10),
(17, 8),
(18, 6),
(19, 1), (19, 7),
(20, 10), (20, 4);

-- LIKES (some users like some articles)
INSERT INTO likes (user_id, article_id) VALUES
(1, 2), (1, 3), (1, 5),
(2, 1), (2, 4),
(3, 6), (3, 7),
(4, 8), (4, 9), (4, 10),
(5, 1), (5, 11),
(6, 17),
(7, 6), (7, 13),
(8, 19),
(9, 20), (9, 16),
(10, 4), (10, 10), (10, 14);

-- COMMENTS
INSERT INTO comments (id, content, created_at, article_id, user_id) VALUES
(1, 'Great read!', '2024-01-02', 1, 2),
(2, 'Nice tips!', '2024-01-03', 2, 1),
(3, 'Thanks for sharing!', '2024-01-04', 3, 4),
(4, 'Very useful!', '2024-01-05', 4, 3),
(5, 'Love this!', '2024-01-06', 5, 7),
(6, 'Well written.', '2024-01-07', 6, 6),
(7, 'I’ll try this.', '2024-01-08', 7, 5),
(8, 'Bookmarking this.', '2024-01-09', 8, 9),
(9, 'Motivating!', '2024-01-10', 9, 10),
(10, 'Awesome article!', '2024-01-11', 10, 8);

-- NOTIFICATIONS
INSERT INTO notifications (id, created_at, is_viewed, user_id, article_id, comment_id) VALUES
(1, '2024-01-03', FALSE, 1, NULL, 1),
(2, '2024-01-04', FALSE, 2, 2, NULL),
(3, '2024-01-05', FALSE, 3, NULL, 3),
(4, '2024-01-06', TRUE, 4, 4, NULL),
(5, '2024-01-07', TRUE, 5, NULL, 5),
(6, '2024-01-08', FALSE, 6, 6, NULL),
(7, '2024-01-09', TRUE, 7, NULL, 7),
(8, '2024-01-10', FALSE, 8, 8, NULL),
(9, '2024-01-11', TRUE, 9, NULL, 9),
(10, '2024-01-12', FALSE, 10, 10, NULL);

-- SUBSCRIPTIONS
INSERT INTO subscriptions (subscriber_user_id, subscribed_user_id) VALUES
(1, 2), (1, 3), (1, 4),
(2, 1), (2, 5),
(3, 6),
(4, 1), (4, 7),
(5, 3),
(6, 2), (6, 8),
(7, 9),
(8, 10),
(9, 5),
(10, 4);