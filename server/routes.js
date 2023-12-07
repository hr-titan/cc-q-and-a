var controller = require('./controllers');
var router = require('express').Router();


router.get('/qa/questions', controller.questions.get);

router.post('/qa/questions', controller.questions.post);

router.put('/qa/questions/:question_id/helpful', controller.questions.putHelpfulQuestions);

router.put('/qa/questions/:question_id/report', controller.questions.putReportQuestions);

router.get('/qa/questions/:question_id/answers', controller.answers.get);

router.post('/qa/questions/:question_id/answers', controller.answers.post);

router.put('/qa/answers/:answer_id/helpful', controller.answers.putHelpfulAnswers);

router.put('/qa/answers/:answer_id/report', controller.answers.putReportAnswers);

module.exports = router;