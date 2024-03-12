var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController')


//GET user sign-up
router.get('/sign-up', user_controller.user_sign_up_get)

//POST user sign-up
router.post('/sign-up', user_controller.user_sign_up_post)

//GET user delete
router.get('/:id/delete', user_controller.delete_user_get)

//POST user delete
router.post('/:id/delete', user_controller.delete_user_post)

//GET user update
router.get('/:id/update', user_controller.user_update_get)

//POST user update
router.post('/:id/update',user_controller.user_update_post)

//GET user password change
router.get('/:id/changepassword', user_controller.change_user_password_get)

//POST user password change
router.post('/:id/changepassword', user_controller.change_user_password_post)

//GET user membership update

//POST user membership update

/* GET users Profile. */
router.get('/:id', user_controller.user_profile_get);

module.exports = router;
