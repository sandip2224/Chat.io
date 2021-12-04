const router = require('express').Router()

const chatModel = require('../models/Chat')

router.get('/', (req, res) => {
    res.render('index')
})

router.post('/chat', async (req, res) => {
    if ((req.body.room)[1].length === 0) roomName = (req.body.room)[0]
    else roomName = (req.body.room)[1]
    const chats = await chatModel.find()
    res.render('chat', { chats: chats, roomVal: roomName, userVal: req.body.username })
})

router.get('/chat', (req, res) => {
    res.redirect('/')
})

module.exports = router