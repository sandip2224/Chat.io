const VAPID_PUBLIC = 'BO_DeYGvxJZ8SfL16UDMlW2XSzXLRldLOjv11Cv1BhDyAiMBoTKZ3uMS6jcuj52z4X5C53BIxQN1dcjy4cVRxHY'

const uname = document.getElementById('user-name').innerHTML
const rname = document.getElementById('room-name').innerHTML

let registration;

const subscribe = async () => {
	console.log('Inside subscriber')
	try {
		await registration.pushManager.getSubscription()
		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: VAPID_PUBLIC
		})

		// Sending subscription object to server
		fetch('http://localhost:3000/register-push-device', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: [
				JSON.stringify({ subscription: subscription, name: uname, room: rname })
			]
		})
	}
	catch (err) {
		console.log(err)
	}
}

const unsubscribe = async () => {
	console.log('Inside unsubscriber')
	try {
		await navigator.serviceWorker.getRegistration()
		const subscription = await registration.pushManager.getSubscription()
		if (subscription) {
			await subscription.unsubscribe()
			console.log('Successfully unsubscribed')
			fetch('http://localhost:3000/deregister-push-device', {
				method: 'DELETE',
				headers: {
					'Content-type': 'application/json'
				},
				body: [
					JSON.stringify({ subscription: subscription, name: uname, room: rname })
				]
			})
		}
		else {
			console.log('User is not subscribed')
		}
	}
	catch (err) {
		console.log('Unsubscription failed', err)
	}
}

if ('serviceWorker' in navigator) {
	window.addEventListener('load', async () => {
		try {
			registration = await navigator.serviceWorker.register('/js/worker.js')
			console.log('Service worker registered successfully!!');
		}
		catch (err) {
			console.error('Error during service worker registration:', err);
		}
	})
}
else {
	console.log('Notification not supported by this browser!!')
}