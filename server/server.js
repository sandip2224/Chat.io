const express = require('express')
const path = require('path')
const http = require('http')
const colors = require("colors")
const socketio = require('socket.io')
const webpush = require('web-push')
require("dotenv").config({ path: "./.env" })

const formatMessage = require('../client/utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('../client/utils/users')
const connectDB = require('./config/db')

const chatModel = require('./models/Chat')
const subModel = require('./models/Subscription')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const vapidKeys = {
	publicKey: 'BO_DeYGvxJZ8SfL16UDMlW2XSzXLRldLOjv11Cv1BhDyAiMBoTKZ3uMS6jcuj52z4X5C53BIxQN1dcjy4cVRxHY',
	privateKey: process.env.PRIVATE_KEY
}

let subscriptions = []

webpush.setVapidDetails('mailto:test@test.com', vapidKeys.publicKey, vapidKeys.privateKey)

connectDB()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../client/views'));

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static(path.join(__dirname, '../client/public')))
app.use('/', require('./routes/chatRoute'))

// Push notification endpoints BEGIN

app.post('/register-push-device', async (req, res) => {
	const { subscription, name, room } = req.body
	const flag = await subModel.exists({ endpoint: subscription.endpoint, key_p256dh: subscription.keys.p256dh, key_auth: subscription.keys.auth, name: name, room: room })
	console.log(flag)
	if (!flag) {
		const subObj = {
			endpoint: subscription.endpoint,
			key_p256dh: subscription.keys.p256dh,
			key_auth: subscription.keys.auth,
			name: name,
			room: room
		}
		const newSub = new subModel(subObj)
		await newSub.save()
		console.log(`Successfully subscribed ${name} to room ${room} notifications`)
	}
	else {
		console.log('User is already registered!!')
	}
	res.end()
})

app.delete('/deregister-push-device', async (req, res) => {
	console.log('Unregistering user subscription...')

	const { subscription, name, room } = req.body

	await subModel.findOneAndDelete({ endpoint: subscription.endpoint, key_p256dh: subscription.keys.p256dh, key_auth: subscription.keys.auth, name: name, room: room })

	console.log(`Successfully unsubscribed ${name} from room ${room} notifications!!`)
})

app.post('/send-notification', async (req, res) => {
	const { msg, username } = req.body
	const notifBody = {
		msg: msg.text,
		user: msg.username
	}

	console.log('Sending notification: ', notifBody)
	const subscriptions = await subModel.find()
	subscriptions.forEach((item) => {

		const itemSubscription = {
			"endpoint": `${item.endpoint}`,
			"expirationTime": null,
			"keys": {
				"p256dh": `${item.key_p256dh}`,
				"auth": `${item.key_auth}`
			}
		}

		if (item.room === msg.room && item.name === username) {
			webpush.sendNotification(itemSubscription, JSON.stringify(notifBody)).catch(error => {
				console.error(error)
			})
		}
	})
	res.end()
})

// Push notification endpoints END

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
	})

	// Run when client disconnects
	socket.on('disconnect', async () => {
		const user = userLeave(socket.id)
		if (user) {
			console.log('Unregistering user subscription...')

			const { username, room } = user

			await subModel.findOneAndDelete({ name: username, room: room })


			console.log(`Successfully unsubscribed ${user.username} from room ${user.room} notifications`)
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