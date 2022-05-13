self.addEventListener('push', event => {
	// event.waitUntil(
	console.log(event.data)
	self.registration.showNotification(event.data.text().user, {
		body: event.data.text().msg
	})
	// )
})