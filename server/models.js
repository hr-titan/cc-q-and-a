const db = require('./db');

module.exports = {
  getQuestions: async (productId, page = 1, count = 5) => {
    const offset = (page - 1) * count;

    const questions = await db.any('SELECT * FROM questions WHERE product_id = $1 LIMIT $2 OFFSET $3', [productId, count, offset]);

    for (const question of questions) {
      const answers = await db.any('SELECT * FROM answers WHERE question_id = $1', [question.question_id]);
      question.answers = {};

      for (const answer of answers) {
        const photos = await db.any('SELECT * FROM answers_photos WHERE answer_id = $1', [answer.answer_id]);
        answer.photos = photos;
        question.answers[answer.answer_id] = answer;
      }
    }
    return {
      product_id: productId,
      results: questions
    };
  },

  getAnswers: async (questionId, page = 1, count = 5) => {
    const offset = (page - 1) * count;

    const answers = await db.any(`
        SELECT a.answer_id, a.body, a.date, a.answerer_name, a.helpfulness
        FROM answers a
        WHERE a.question_id = $1
        ORDER BY a.date DESC
        LIMIT $2 OFFSET $3`, [questionId, count, offset]);

    for (const answer of answers) {
      const photos = await db.any('SELECT photo_id as id, url FROM answers_photos WHERE answer_id = $1', [answer.answer_id]);
      answer.photos = photos;
    }

    return {
      question: questionId.toString(),
      page: page,
      count: count,
      results: answers
    };
  },

  postQuestion: async (productId, questionBody, askerName, askerEmail) => {
    const query = `
    INSERT INTO questions (product_id, question_body, asker_name, asker_email, question_date, question_helpfulness, reported)
    VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 0, false)
    RETURNING question_id;`;
    try {
      const result = await db.one(query, [productId, questionBody, askerName, askerEmail]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  postAnswer: async (questionId, answerBody, answererName, answererEmail, answerPhotos) => {
    return db.tx(async transaction => {
      const answerResult = await transaction.one(`
            INSERT INTO answers (question_id, body, answerer_name, answerer_email, date)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            RETURNING answer_id, date`,
        [questionId, answerBody, answererName, answererEmail]);

      const answerId = answerResult.answer_id;
      const answerDate = answerResult.date;

      if (answerPhotos && answerPhotos.length > 0) {
        const photoInserts = answerPhotos.map(photoUrl =>
          transaction.none(`INSERT INTO answers_photos (answer_id, url) VALUES ($1, $2)`, [answerId, photoUrl])
        );
        await transaction.batch(photoInserts);
      }

      return {
        answer_id: answerId,
        question_id: questionId,
        answer_body: answerBody,
        answer_date: answerDate,
        answerer_name: answererName,
        answerer_email: answererEmail,
        photos: answerPhotos
      };
    });
  },

  helpfulQuestions: async (questionId) => {
    const query = `
    UPDATE questions
    SET helpfulness = helpfulness + 1
    WHERE question_id = $1;`;
    try {
      await db.none(query, [questionId]);
      return { message: 'Question updated Successfully' };
    } catch (error) {
      throw error;
    }
  },

  reportQuestion: async (questionId) => {
    const query = `
        UPDATE questions
        SET reported = true
        WHERE question_id = $1
        RETURNING *;`;

    try {
      const updatedQuestion = await db.one(query, [questionId]);
      return updatedQuestion;
    } catch (error) {
      throw error;
    }
  },

  helpfulAnswers: async (answerId) => {
    const query = `
    UPDATE answers
    SET helpfulness = helpfulness + 1
    WHERE answer_id = $1;`;
    try {
      await db.none(query, [answerId]);
      return { message: 'Answer updated Successfully' };
    } catch (error) {
      throw error;
    }
  },

  reportAnswer: async (answerId) => {
    const query = `
        UPDATE answers
        SET reported = true
        WHERE answer_id = $1
        RETURNING *;`;

    try {
      const updatedAnswer = await db.one(query, [answerId]);
      return updatedAnswer;
    } catch (error) {
      throw error;
    }
  },
}
