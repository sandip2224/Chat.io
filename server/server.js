const express = require('express')
const path = require('path')
const axios = require('axios').default
const http = require('http')
const colors = require('colors')
const socketio = require('socket.io')
const webpush = require('web-push')
require('dotenv').config({ path: './.env' })

// Utility functions
const formatMessage = require('../client/utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('../client/utils/users')
const connectDB = require('./config/db')

// Database Models
const chatModel = require('./models/Chat')
const subModel = require('./models/Subscription')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const vapidKeys = {
	publicKey: process.env.PUBLIC_KEY,
	privateKey: process.env.PRIVATE_KEY
}

webpush.setVapidDetails('mailto:test@test.com', vapidKeys.publicKey, vapidKeys.privateKey)

connectDB()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../client/views'));

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static(path.join(__dirname, '../client/public')))
app.use('/', require('./routes/chatRoute'))
app.use('/', require('./routes/notifRoute'))

const baseUrl = process.env.BASE_URL

// Run when client connects
io.on('connection', (socket) => {
	socket.on('joinRoom', ({ username, room }) => {
		// Generate a new user object with the supplied user details { id, username, room }
		const user = userJoin(socket.id, username, room)

		// Pushes a user socket to the given room
		socket.join(user.room)

		// Welcome adminMessage for client alone who connects
		socket.emit('message', formatMessage('Admin', `Welcome to Chat.io ${user.username}!!`))

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
		const frmtMsg = formatMessage(user.username, msg, user.room)
		const obj = {
			username: `${frmtMsg.username}`,
			time: `${frmtMsg.time} (${frmtMsg.date})`,
			message: `${frmtMsg.text}`,
			room: `${user.room}`
		}
		const newMsg = new chatModel(obj)
		await newMsg.save()

		io.to(user.room).emit('message', frmtMsg)
		axios.post(`${baseUrl}/send-notification`, {
			msg: frmtMsg
		})
	})

	// Run when client disconnects
	socket.on('disconnect', async () => {
		const user = userLeave(socket.id)
		if (user) {
			const { username, room } = user

			await subModel.findOneAndDelete({ name: username, room: room })

			console.log(`[EXIT] Successfully unsubscribed ${user.username} from room ${user.room} notifications!`)
			io.to(user.room).emit('message', formatMessage('Admin', `${user.username} has left the chat`))

			// Send users and room info to every client
			io.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getRoomUsers(user.room)
			})
		}
	})
})

const conn = server.listen(process.env.PORT || 3000, console.log(`🚀 Server running in ${process.env.NODE_ENV} mode at: ${process.env.BASE_URL}`.green.bold))
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red)
	conn.close(() => process.exit(1))
})