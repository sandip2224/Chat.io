const VAPID_PUBLIC = 'BO_DeYGvxJZ8SfL16UDMlW2XSzXLRldLOjv11Cv1BhDyAiMBoTKZ3uMS6jcuj52z4X5C53BIxQN1dcjy4cVRxHY'

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
			console.log(`${uname} is not subscribed to room ${room} notifications`)
		}
	}
	catch (err) {
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
	console.log('Notification not supported by this browser!!')
}