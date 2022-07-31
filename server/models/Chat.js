const Sequelize = require('sequelize')
const db = require('../config/db')

const chatSchema = db.define('chat', {
    username: {
        type: Sequelize.STRING
    },
    time: {
        type: Sequelize.STRING
    },
    message: {
        type: Sequelize.STRING
    },
    room: {
        type: Sequelize.STRING
    }
})

chatSchema.sync()
    .then(console.log('Chat table has been created!!'))
    .catch(err => console.error('Chat table creation failed!!'))

module.exports = chatSchema