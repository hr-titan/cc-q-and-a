const Redis = require('ioredis');
const models = require('./models');
const redis = new Redis();

module.exports = {
  getQuestions: async (req, res) => {
    try {
      const productId = parseInt(req.query.product_id);
      const page = parseInt(req.query.page) || 1;
      const count = parseInt(req.query.count) || 5;

      const cacheKey = `questions:${productId}:${page}:${count}`;
      const cachedQuestions = await redis.get(cacheKey);

      if (cachedQuestions) {
        res.json(JSON.parse(cachedQuestions));
      } else {
        const questions = await models.getQuestions(productId, page, count);
        await redis.set(cacheKey, JSON.stringify(questions), 'EX', 86400);
        res.json(questions);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

  getRandomQuestions: async (req, res) => {
    try {
      const productId = Math.floor(Math.random() * 3500000) + 1;
      const page = Math.floor(Math.random() * 10) + 1;
      const counts = [5, 10, 20, 30];
      const count = counts[Math.floor(Math.random() * counts.length)];

      const cacheKey = `questions:${productId}:${page}:${count}`;
      const cachedQuestions = await redis.get(cacheKey);

      if (cachedQuestions) {
        res.json(JSON.parse(cachedQuestions));
      } else {
        const questions = await models.getQuestions(productId, page, count);
        await redis.set(cacheKey, JSON.stringify(questions), 'EX', 86400);
        res.json(questions);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

  getAnswers: async (req, res) => {
    try {
      const questionId = parseInt(req.params.question_id);
      const page = parseInt(req.query.page) || 1;
      const count = parseInt(req.query.count) || 5;
      const answers = await models.getAnswers(questionId, page, count);
      res.json(answers);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

  postQuestion: async (req, res) => {
    try {
      const { product_id: productId, body: questionBody, name: askerName, email: askerEmail } = req.body;
      const newQuestion = await models.postQuestion(productId, questionBody, askerName, askerEmail);

      res.status(201).json({
        question_id: newQuestion.question_id,
        product_id: newQuestion.product_id,
        question_body: newQuestion.question_body,
        question_date: newQuestion.question_date,
        asker_name: newQuestion.asker_name,
        asker_email: newQuestion.asker_email,
        question_helpfulness: newQuestion.question_helpfulness,
        reported: newQuestion.reported,
        answers: {}
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

  putHelpfulQuestions: async (req, res) => {
    try {
      const questionId = parseInt(req.params.question_id);

      await models.helpfulQuestions(questionId);

      res.status(204).send('Question marked helpful');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error')
    }

  },

  postAnswers: async (req, res) => {
    try {
      const questionId = parseInt(req.params.question_id);
      const { body: answerBody, name: answererName, email: answererEmail, photos: answerPhotos } = req.body;

      const newAnswer = await models.postAnswer(questionId, answerBody, answererName, answererEmail, answerPhotos);

      res.status(201).json({
        answer_id: newAnswer.answer_id,
        question_id: questionId,
        body: newAnswer.answer_body,
        date: newAnswer.date,
        answerer_name: newAnswer.answerer_name,
        helpfulness: newAnswer.helpfulness,
        reported: newAnswer.reported,
        photos: newAnswer.photos
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

  putReportQuestions: async (req, res) => {
    try {
      const questionId = parseInt(req.params.question_id);

      await models.reportQuestion(questionId);

      res.status(200).send({ message: 'Question reported successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

  putHelpfulAnswers: async (req, res) => {
    try {
      const answerId = parseInt(req.params.answer_id);

      await models.helpfulAnswers(answerId);

      res.status(204).send('Answer marked helpful');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error')
    }

  },

  putReportAnswers: async (req, res) => {
    try {
      const answerId = parseInt(req.params.answer_id);

      await models.reportAnswer(answerId);

      res.status(200).send({ message: 'Answer reported successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },
}

