const express = require('express');
const controllers = require('./controllers');
const router = express.Router();


router.get('/qa/questions', controllers.getQuestions);

router.post('/qa/questions', controllers.postQuestion);

router.get('/qa/questions/:question_id/answers', controllers.getAnswers);

router.post('/qa/questions/:question_id/answers', controllers.postAnswers);

router.put('/qa/questions/:question_id/helpful/', controllers.putHelpfulQuestions);

router.put('/qa/questions/:question_id/report', controllers.putReportQuestions);

router.put('/qa/answers/:answer_id/helpful', controllers.putHelpfulAnswers);

router.put('/qa/answers/:answer_id/report', controllers.putReportAnswers);

module.exports = router;