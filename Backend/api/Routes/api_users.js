let express = require('express')
let router = express.Router()
const api_user_controller = require('../Controllers/API_USER/api_userController')


router.post('/signin', api_user_controller.login)
router.post('/signup', api_user_controller.signup)
router.delete('/delete', api_user_controller.delete_user)
router.post('/refresh', api_user_controller.refresh)
router.put('/favoritetopic', api_user_controller.favorite_topic)
router.put('/unfavoritetopic', api_user_controller.unfavorite_topic)
router.put('/update', api_user_controller.update_user)
router.put('/changepassword', api_user_controller.change_password)
router.get('/logout', api_user_controller.logout)
router.get('/detail', api_user_controller.get_user_detail)

module.exports = router