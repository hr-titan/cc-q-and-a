var controller = require('./controllers');
var router = require('express').Router();


router.get('/qa/questions', controller.questions.get);

router.post('/qa/questions', controller.questions.post);

router.put('/qa/questions/:question_id/helpful', controller.questions.putHelpful);

router.put('/qa/questions/:question_id/report', controller.questions.putReport);

// router.get('/qa/questions/:question_id/answers', controller.answers.get);

router.post('/qa/questions/:question_id/answers', controller.answers.post);

router.put('/qa/questions/:question_id/answers', controller.answers.putHelpful);

router.put('/qa/questions/:question_id/answers', controller.answers.putReport);


module.exports = router;