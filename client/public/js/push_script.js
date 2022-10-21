const VAPID_PUBLIC = 'BOp7ObI4oHoXiYMJjUkKC-ZqsVoeaeuQGf0eJrWdiqOi1miXd8HmgnstQX0A1qz6RbQKOziahykhT0EW9bW1q4Q'

const uname = document.getElementById('user-name').innerHTML
const rname = document.getElementById('room-name').innerHTML

// Change to production url on deployment
const baseUrl = 'http://localhost:3000'

let registration;

const subscribe = async () => {
	try {
		await registration.pushManager.getSubscription()
		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: VAPID_PUBLIC
		})

		// Sending subscription object to server
		fetch(`${baseUrl}/register-push-device`, {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: [JSON.stringify({ subscription: subscription, name: uname, room: rname })]
		})

		alert(`[SUCCESS] Subscribed ${uname} to room ${rname} notifications!`)
		console.log(`[SUCCESS] Subscribed ${uname} to room ${rname} notifications!`)
	}
	catch (err) {
		alert('[ERROR] Subscription failed! Check browser console for details!')
		console.log('[ERROR] Subscription failed: ', err)
	}
}

const unsubscribe = async () => {
	try {
		await navigator.serviceWorker.getRegistration()
		const subscription = await registration.pushManager.getSubscription()
		if (subscription) {
			await subscription.unsubscribe()

			fetch(`${baseUrl}/deregister-push-device`, {
				method: 'DELETE',
				headers: { 'Content-type': 'application/json' },
				body: [JSON.stringify({ subscription: subscription, name: uname, room: rname })]
			})

			alert(`[SUCCESS] Unsubscribed ${uname} from room ${rname} notifications!`)
			console.log(`[SUCCESS] Unsubscribed ${uname} from room ${rname} notifications!`)
		}
		else {
			alert(`OOPS! ${uname} is not subscribed to room ${room} notifications!`)
			console.log(`OOPS! ${uname} is not subscribed to room ${room} notifications!`)
		}
	}
	catch (err) {
		alert('[ERROR] Unsubscription failed! Check browser console for details!')
		console.log('[ERROR] Unsubscription failed: ', err)
	}
}

if ('serviceWorker' in navigator) {
	window.addEventListener('load', async () => {
		try {
			registration = await navigator.serviceWorker.register('/js/worker.js')
			console.log('[SUCCESS] Service worker registered!!')
		}
		catch (err) {
			console.error('[ERROR] Service worker registration failed: ', err)
		}
	})
}
else {
	console.log('[ERROR] Notifications not supported by this browser!!')
}