-- Insert data into users table

INSERT INTO users(email, first_name, last_name, password_hash, avatar) VALUES
('jackson@example.com', 'Michael', 'Jackson', 'ha21nskz83jsnjcxdnqi9123bb1123b12', 'avatar-1.jpg'),
('williams@example.com', 'Tony', 'Williams', 'ha21nskz83jsnjcxdnqi9123bb1123b12', 'avatar-2.jpg');

-- Insert data into categories table

INSERT INTO categories(name) VALUES
('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование');

-- Insert data into articles table

ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, photo, announcement, full_text, user_id) VALUES
('Что такое золотое сечение', 'image1.jpg', 'Золотое сечение — соотношение двух величин, гармоническая пропорция', 'Ёлки — это не просто красивое дерево. Это прочная древесина.', 1),
('Как собрать камни бесконечности', 'image2.jpg', 'Это один из лучших рок-музыкантов.', 'Это где ж такие красоты?', 2),
('Лучшие рок-музыканты 20-века', 'image3.jpg', 'Из под его пера вышло 8 платиновых альбомов', 'Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать', 2);
ALTER TABLE articles ENABLE TRIGGER ALL;

-- Insert data into article_categories table

ALTER TABLE article_categories DISABLE TRIGGER ALL;
INSERT INTO article_categories(article_id, category_id) VALUES
(1, 1),
(1, 2),
(1, 4),
(2, 5),
(2, 7),
(3, 4),
(3, 6),
(3, 8);
ALTER TABLE article_categories ENABLE TRIGGER ALL;

-- Insert data into comments table

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(user_id, article_id, text) VALUES
(1, 1, 'Плюсую, но слишком много буквы!'),
(2, 1, 'Совсем немного...'),
(1, 2, 'Плюсую, но слишком много буквы!'),
(2, 2, 'Совсем немного...'),
(1, 3, 'Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.'),
(2, 3, 'Мне кажется или я уже читал это где-то?');
ALTER TABLE comments ENABLE TRIGGER ALL;
