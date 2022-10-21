const router = require('express').Router()
require('dotenv').config({ path: './.env' })

const chatModel = require('../models/Chat')

router.get('/', (req, res) => {
    res.render('index')
})

router.post('/chat', async (req, res) => {
    if (Array.isArray(req.body.room)) roomName = (req.body.room)[0]
    else roomName = (req.body.room)
    const chats = await chatModel.find()
    res.render('chat', { chats: chats, roomVal: roomName, userVal: req.body.username, vapidPublic: process.env.PUBLIC_KEY, baseUrl: process.env.BASE_URL })
})

router.get('/chat', (req, res) => {
    console.log('[403] You are not authorized to access the endpoint. Please enter valid credentials!!')
    res.redirect('/')
})

module.exports = router