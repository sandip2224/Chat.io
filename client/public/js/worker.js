self.addEventListener('push', event => {
	event.waitUntil(
		self.registration.showNotification(event.data.text().user, {
			body: event.data.text().msg
		})
	)
})