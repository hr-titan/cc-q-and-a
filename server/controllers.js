const models = require('./models');


module.exports = {
  getQuestions: () => {
    async get(req, res) {
      try {
        const productId = parseInt(req.query.product_id);
        const page = parseInt(req.query.page) || 1;
        const count = parseInt(req.query.count) || 5;
        const questions = await models.getQuestions(productId, page, count);
        res.json(questions);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    }
  },

  getAnswers: () => {

  },

  postQuestions: () => {

  },

  postAnswers: () => {

  },

  putHelpfulQuestions: () => {

  },

  putReportQuestions: () => {

  },

  putHelpfulAnswers: () => {

  },

  putReportAnswers: () => {

  },
}

