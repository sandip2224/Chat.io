const router = require('express').Router()

const chatModel = require('../models/Chat')


router.get('/', (req, res) => {
    res.render('index')
})

router.post('/chat', async (req, res) => {
    const chats = await chatModel.find()
    res.render('chat', { chats: chats, roomVal: req.body.room, userVal: req.body.username })
})

module.exports = router