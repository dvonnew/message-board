let express = require('express')
let router = express.Router()
const api_search_controller = require('../Controllers/api_search')

router.get('/search', api_search_controller.search)

module.exports = router