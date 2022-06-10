const router = require('express').Router()
const webpush = require('web-push')

const subModel=require('../models/Subscription')

router.post('/register-push-device', async (req, res) => {
	console.log('Registering user subscription...')

	const { subscription, name, room } = req.body
	const flag = await subModel.exists({ endpoint: subscription.endpoint, key_p256dh: subscription.keys.p256dh, key_auth: subscription.keys.auth, name: name, room: room })
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
		console.log(`[SUCCESS] Subscribed ${name} to room ${room} notifications!`)
	}
	else {
		console.log(`${name} is already registered to room ${room} notifications!!`)
	}
})

router.delete('/deregister-push-device', async (req, res) => {
	console.log('Unregistering user subscription...')

	const { subscription, name, room } = req.body
	await subModel.findOneAndDelete({ endpoint: subscription.endpoint, key_p256dh: subscription.keys.p256dh, key_auth: subscription.keys.auth, name, room })

	console.log(`[SUCCESS] Unsubscribed ${name} from room ${room} notifications!`)
})

router.post('/send-notification', async (req, res) => {
	// msg is the object that stores sender information {username,text,time,date,room}
	// username is the name of user who received the message from sender
	const { msg } = req.body
	const notifBody = {
		msg: msg.text,
		user: msg.username
	}

	// Query for subscriptions associated with sender's room only
	const subscriptions = await subModel.find({room: msg.room})
	subscriptions.forEach(item => {

		const itemSubscription = {
			"endpoint": `${item.endpoint}`,
			"expirationTime": null,
			"keys": {
				"p256dh": `${item.key_p256dh}`,
				"auth": `${item.key_auth}`
			}
		}

		if (item.room === msg.room && item.name !== msg.username && item.name !== 'Admin') {
			console.log('[SUCCESS] Sending notification: ', notifBody)
			webpush.sendNotification(itemSubscription, JSON.stringify(notifBody))
				.catch(error => console.error(error))
		}
	})
})

module.exports=router