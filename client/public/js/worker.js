self.addEventListener('push', event => {
	const values = JSON.parse(event.data.text())
	self.registration.showNotification(values.user, {
		body: values.msg
	})
})