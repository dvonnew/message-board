var express = require('express');
var router = express.Router();
let Topic = require('../../models/topic')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Members Only Message Board', 
    user: req.user });
});


module.exports = router;
