let express = require('express')
let router = express.Router()
const api_topic_controller = require('../Controllers/api_topicController')

//Get Topic Page
router.post('/createtopic', api_topic_controller.create_topic)
router.get('/latest', api_topic_controller.get_latest_posts)
router.get('/popular', api_topic_controller.get_popular_posts)
router.get('/favorites', api_topic_controller.get_user_favorites)
router.get('/:topicname', api_topic_controller.get_topic)


module.exports = router