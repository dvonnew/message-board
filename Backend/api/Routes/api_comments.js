let express = require('express')
let router = express.Router()
const api_comment_controller = require('../Controllers/api_commentControllers')

router.post('/createcomment', api_comment_controller.create_comment)
router.delete('/delete', api_comment_controller.delete_comment)
router.get('/getcomments/:id', api_comment_controller.get_comments)

module.exports = router