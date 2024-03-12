let express = require('express')
let router = express.Router()
const api_post_controller = require('../Controllers/api_postContoller')

router.post('/createpost', api_post_controller.create_post)
router.delete('/:id/delete', api_post_controller.delete_post)
router.post('/:id/edit', api_post_controller.edit_post)
router.put('/likepost', api_post_controller.like_post)
router.put('/unlikepost', api_post_controller.unlike_post)
router.get('/getalltopics', api_post_controller.get_all_topics)
router.get('/:id', api_post_controller.get_post)


module.exports = router