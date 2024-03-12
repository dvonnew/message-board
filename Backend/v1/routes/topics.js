var express = require('express');
var router = express.Router();
const topic_controller = require('../controllers/topicContoller')

//Get Create Topic Page
router.get('/createtopic', topic_controller.create_topic_get)

//Post Create Topic Page
router.post('/createtopic', topic_controller.create_topic_post)

//Get Topic Page
router.get('/:name', topic_controller.topic_get)


//ADMIN ROUTES
router.get('/:name/admin_settings', topic_controller.get_admin_settings_page)


module.exports = router


