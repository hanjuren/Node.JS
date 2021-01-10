const express = require('express');

const router = express.Router();

//GET /user 라우터
router.get('/', (req, res) => {
  res.locals.title = 'Express'
  res.render('main');
});
router.get('/:id', function(req, res){
    res.send('Hello ju');
    console.log(req.params, req.query);
});
module.exports = router;