let express = require("express")
let router = express.Router()
const post_controller = require('../controllers/postController')

//Creat Post Get
router.get("/createpost", post_controller.get_create_post_form)

router.post("/createpost", post_controller.post_create_form)

router.get("/:id/edit", post_controller.get_edit_post)

router.post("/:id/edit", post_controller.post_edit_form)

router.get("/:id", post_controller.get_post)

module.exports = router
