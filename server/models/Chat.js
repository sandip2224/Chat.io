const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    username: { type: String },
    time: { type: String },
    message: { type: String },
    room: { type: String }
})

module.exports = mongoose.model('chatModel', chatSchema)