const express = require('express')
const path = require('path')
const http = require('http')
const colors = require("colors")
const socketio = require('socket.io')
require("dotenv").config({ path: "./.env" })

const formatMessage = require('./frontend/utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./frontend/utils/users')
const connectDB = require('./backend/config/db')
const chatModel = require('./backend/models/Chat')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

connectDB()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'frontend/views'));

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'frontend/public')))
app.use('/', require('./backend/routes/chatRoute'))

// Run when client connects
io.on('connection', (socket) => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)

        // Pushes a user socket to the given room
        socket.join(user.room)

        // Welcome adminMessage for client alone who connects
        socket.emit('message', formatMessage('Admin', `Welcome to ChatIO ${user.username}!!`))

        // Broadcast to everyone else when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage('Admin', `${user.username} has joined the chat!!`))

        // Triggered during keypress event on client side
        socket.on('starttype', (msg) => {
            socket.broadcast.to(user.room).emit('type', msg)
        })

        socket.on('stoptype', (msg) => {
            socket.broadcast.to(user.room).emit('type', msg)
        })

        // Send users and room info to every client in a room
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // Listen for chat message from client
    socket.on('chatMessage', async (msg) => {
        const user = getCurrentUser(socket.id)
        const frmtMsg = formatMessage(user.username, msg)
        const obj = {
            username: `${frmtMsg.username}`,
            time: `${frmtMsg.time} (${frmtMsg.date})`,
            message: `${frmtMsg.text}`,
            room: `${user.room}`
        }
        const newMsg = new chatModel(obj)
        await newMsg.save()
        io.to(user.room).emit('message', frmtMsg)
    })

    // Run when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.room).emit('message', formatMessage('Admin', `${user.username} has left the chat`))
            // Send users and room info to every client
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

const conn = server.listen(process.env.PORT || 3000, console.log(`Server running on port ${process.env.PORT || 3000}`))

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    conn.close(() => process.exit(1))
})