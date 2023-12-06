CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    question_body TEXT NOT NULL,
    question_date TIMESTAMP NOT NULL,
    asker_name VARCHAR(255) NOT NULL,
    asker_email VARCHAR(255),
    question_helpfulness INT DEFAULT 0,
    reported BOOLEAN DEFAULT FALSE
);

CREATE TABLE answers (
    answer_id SERIAL PRIMARY KEY,
    question_id INT,
    body TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    answerer_name VARCHAR(255) NOT NULL,
    answerer_email VARCHAR(255),
    helpfulness INT DEFAULT 0,
    reported BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

CREATE TABLE answers_photos (
    photo_id SERIAL PRIMARY KEY,
    answer_id INT,
    url VARCHAR(255) NOT NULL,
    FOREIGN KEY (answer_id) REFERENCES answers(answer_id)
);

CREATE TABLE temp_questions (
    question_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    question_body TEXT NOT NULL,
    question_date BIGINT NOT NULL,
    asker_name VARCHAR(255) NOT NULL,
    asker_email VARCHAR(255),
    question_helpfulness INT DEFAULT 0,
    reported BOOLEAN DEFAULT FALSE
);

CREATE TABLE temp_answers (
    answer_id SERIAL PRIMARY KEY,
    question_id INT,
    body TEXT NOT NULL,
    date BIGINT NOT NULL,
    answerer_name VARCHAR(255) NOT NULL,
    answerer_email VARCHAR(255),
    helpfulness INT DEFAULT 0,
    reported BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

COPY temp_questions(question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
FROM '/Users/colincooley/Hack Reactor/SDC/dataFiles/questions.csv'
WITH CSV HEADER;

INSERT INTO questions (question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
SELECT
    question_id,
    product_id,
    question_body,
    TO_TIMESTAMP(question_date / 1000),
    asker_name,
    asker_email,
    reported,
    question_helpfulness
FROM temp_questions;

COPY temp_answers(answer_id, question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
FROM '/Users/colincooley/Hack Reactor/SDC/dataFiles/answers.csv'
WITH CSV HEADER;

INSERT INTO answers (answer_id, question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
SELECT
    answer_id,
    question_id,
    body,
    TO_TIMESTAMP(date / 1000),
    answerer_name,
    answerer_email,
    reported,
    helpfulness
FROM temp_answers;

COPY answers_photos(photo_id, answer_id, url)
FROM '/Users/colincooley/Hack Reactor/SDC/dataFiles/answers_photos.csv'
WITH CSV HEADER;

DROP TABLE temp_answers;

DROP TABLE temp_questions;



