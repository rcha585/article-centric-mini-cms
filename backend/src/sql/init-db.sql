DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS taggings;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS avatars;

CREATE TABLE avatars (
    id INTEGER PRIMARY KEY,
    avatar_path VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth TEXT NOT NULL,
    description VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    avatar_id INTEGER,
    FOREIGN KEY (avatar_id) REFERENCES avatars(id) ON DELETE SET NULL
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

-- Avatars
INSERT INTO avatars (id, avatar_path) VALUES
(1, 'avatars/avatar1.png'),
(2, 'avatars/avatar2.png'),
(3, 'avatars/avatar3.png'),
(4, 'avatars/avatar4.png'),
(5, 'avatars/avatar5.png'),
(6, 'avatars/avatar6.png'),
(7, 'avatars/avatar7.png'),
(8, 'avatars/avatar8.png'),
(9, 'avatars/avatar9.png'),
(10, 'avatars/avatar10.png');

-- Users
INSERT INTO users (id, username, password, first_name, last_name, date_of_birth, description, is_admin, avatar_id) VALUES
(1, 'admin_user', '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Alice', 'Admin', '1980-01-01', 'System administrator.', 1, 1),
(2, 'johndoe', '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'John', 'Doe', '1990-05-12', 'Loves hiking and outdoor adventures.', 0, 2),
(3, 'janedoe', '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Jane', 'Doe', '1992-07-24', 'Passionate about cooking and tech.', 0, 3),
(4, 'mike99', '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Mike', 'Smith', '1985-03-10', 'Enjoys writing and reading.', 0, 4),
(5, 'lucy_lu', '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Lucy', 'Lu', '1993-08-08', 'Photographer and traveler.', 0, 5),
(6, 'bobby88', '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Bob', 'Brown', '1988-11-22', 'Music lover and gamer.', 0, 6),
(7, 'nina_star', '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Nina', 'Star', '1995-04-18', 'Dancer and art enthusiast.', 0, 7),
(8, 'tommyT', '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Tom', 'Taylor', '1991-09-14', 'Fitness freak and tech geek.', 0, 8),
(9, 'emmaW', '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Emma', 'Wilson', '1996-12-03', 'Writer and poet.', 0, 9),
(10, 'leoKing', '$2b$10$S95qbYMTb5B.AzIsYZPxJ.RCV4nVn1Ghal6zvYUWuVW3WpXsQRH.G', 'Leo', 'King', '1989-06-17', 'Entrepreneur and investor.', 0, 10);

-- Tags
INSERT INTO tags (id, content) VALUES
(1, 'Technology'),
(2, 'Health'),
(3, 'Travel'),
(4, 'Education'),
(5, 'Science'),
(6, 'Environment'),
(7, 'Food'),
(8, 'Art'),
(9, 'Sports'),
(10, 'Finance');

-- Articles
INSERT INTO articles (id, title, content, created_at, image_path, author_id) VALUES
(1, 'The Rise of AI', 'AI is changing the world rapidly.', '2025-05-01', 'images/ai.png', 1),
(2, 'Healthy Living Tips', 'How to live a healthier life.', '2025-05-02', 'images/health.png', 2),
(3, 'Exploring Japan', 'A journey through Tokyo and beyond.', '2025-05-03', 'images/japan.png', 3),
(4, 'Online Learning Growth', 'Education is moving online.', '2025-05-04', 'images/education.png', 4),
(5, 'Mars Exploration', 'Space missions to the red planet.', '2025-05-05', 'images/mars.png', 5),
(6, 'Green Energy', 'Renewables for a sustainable future.', '2025-05-06', 'images/green.png', 6),
(7, 'World Cuisines', 'Discover flavors across the globe.', '2025-05-07', 'images/food.png', 7),
(8, 'Art in the Modern Era', 'Digital art and NFTs.', '2025-05-08', 'images/art.png', 8),
(9, 'Olympic Highlights', 'Recap of the major events.', '2025-05-09', 'images/sports.png', 9),
(10, 'Investing 101', 'Basics of stock market.', '2025-05-10', 'images/finance.png', 10),
(11, 'Future of Tech', 'Trends to watch in 2025.', '2025-05-11', 'images/future.png', 1),
(12, 'Mindfulness Practices', 'Mental wellness techniques.', '2025-05-12', 'images/mindfulness.png', 2),
(13, 'Backpacking Europe', 'Affordable travel guides.', '2025-05-13', 'images/europe.png', 3),
(14, 'E-learning Platforms', 'Top platforms for education.', '2025-05-14', 'images/elearning.png', 4),
(15, 'Quantum Computers', 'The next revolution?', '2025-05-15', 'images/quantum.png', 5),
(16, 'Climate Change Impact', 'What science tells us.', '2025-05-16', 'images/climate.png', 6),
(17, 'Vegan Recipes', 'Delicious and healthy.', '2025-05-17', 'images/vegan.png', 7),
(18, 'Photography Trends', 'New gear and styles.', '2025-05-18', 'images/photo.png', 8),
(19, 'World Cup Recap', 'Goals and surprises.', '2025-05-19', 'images/worldcup.png', 9),
(20, 'Personal Finance', 'Saving and budgeting tips.', '2025-05-20', 'images/savings.png', 10);

-- Comments
INSERT INTO comments (id, content, created_at, article_id, user_id) VALUES
(1, 'Amazing article!', '2025-05-01', 1, 2),
(2, 'Very informative.', '2025-05-02', 2, 3),
(3, 'Loved this piece.', '2025-05-03', 3, 4),
(4, 'Great insights!', '2025-05-04', 4, 5),
(5, 'Thanks for sharing.', '2025-05-05', 5, 6),
(6, 'Well written.', '2025-05-06', 6, 7),
(7, 'Fantastic job!', '2025-05-07', 7, 8),
(8, 'Keep it up!', '2025-05-08', 8, 9),
(9, 'I learned a lot.', '2025-05-09', 9, 10),
(10, 'Very detailed.', '2025-05-10', 10, 1),
(11, 'Interesting read.', '2025-05-11', 11, 2),
(12, 'Nice topic!', '2025-05-12', 12, 3),
(13, 'This helped me.', '2025-05-13', 13, 4),
(14, 'So useful.', '2025-05-14', 14, 5),
(15, 'Cool stuff!', '2025-05-15', 15, 6);

-- Notifications
INSERT INTO notifications (id, created_at, is_viewed, user_id, article_id, comment_id) VALUES
(1, '2025-05-16', 0, 1, 1, NULL),
(2, '2025-05-16', 1, 2, NULL, 2),
(3, '2025-05-16', 0, 3, 3, NULL),
(4, '2025-05-16', 1, 4, NULL, 4),
(5, '2025-05-16', 0, 5, 5, NULL),
(6, '2025-05-16', 1, 6, NULL, 6),
(7, '2025-05-16', 0, 7, 7, NULL),
(8, '2025-05-16', 1, 8, NULL, 8),
(9, '2025-05-16', 0, 9, 9, NULL),
(10, '2025-05-16', 1, 10, NULL, 10),
(11, '2025-05-16', 0, 1, 11, NULL),
(12, '2025-05-16', 1, 2, NULL, 12),
(13, '2025-05-16', 0, 3, 13, NULL),
(14, '2025-05-16', 1, 4, NULL, 14),
(15, '2025-05-16', 0, 5, 15, NULL);

-- Subscriptions
INSERT INTO subscriptions (subscriber_user_id, subscribed_user_id) VALUES
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7);

-- Taggings
INSERT INTO taggings (article_id, tag_id) VALUES
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
(11, 1),
(12, 2),
(13, 3),
(14, 4),
(15, 5),
(16, 6),
(17, 7),
(18, 8),
(19, 9),
(20, 10),
(1, 3),
(2, 4),
(3, 5),
(4, 6),
(5, 7),
(6, 8),
(7, 9),
(8, 10),
(9, 1),
(10, 2);

-- Likes
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
(1, 11),
(2, 12),
(3, 13),
(4, 14),
(5, 15),
(6, 16),
(7, 17),
(8, 18),
(9, 19),
(10, 20),
(2, 1),
(3, 2),
(4, 3),
(5, 4),
(6, 5),
(7, 6),
(8, 7),
(9, 8),
(10, 9),
(1, 10);