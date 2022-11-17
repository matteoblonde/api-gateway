
const express = require('express');
const router = express.Router()
const feedService = require('./updaterService')
const hashtagService = require('./operativeDocs')

router.use((req, res, next) => {
    console.log("Called: ", req.path)
    next()
})

router.use(feedService)
router.use(hashtagService)

module.exports = router
