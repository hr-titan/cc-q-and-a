const db = require('./db');

module.exports = {
  getQuestions: async (productId, page = 1, count = 5) => {
    const offset = (page - 1) * count;
    const query = `
    SELECT question_id, question_body, question_date, asker_name, question_helpfulness, reported
    FROM questions
    WHERE product_id = $1
    LIMIT $2 OFFSET $3`;

    try {
      const questions = await db.any(query, [productId, count, offset]);
      return questions;
    } catch (error) {
      throw error;
    }
  },
}