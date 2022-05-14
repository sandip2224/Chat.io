self.addEventListener('push', event => {
	const values = JSON.parse(event.data.text())
	console.log(values)
	self.registration.showNotification(values.user, {
		body: values.msg
	})
})