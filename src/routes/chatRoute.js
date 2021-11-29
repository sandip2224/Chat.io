const router = require('express').Router()

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/chat', (req, res) => {
    res.render('chat')
})

module.exports = router