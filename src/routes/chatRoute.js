const router = require('express').Router()

const chatModel = require('../models/Chat')


router.get('/', (req, res) => {
    res.render('index')
})

router.get('/chat', async (req, res) => {
    const chats = await chatModel.find()
    res.render('chat', { chats: chats })
})

module.exports = router