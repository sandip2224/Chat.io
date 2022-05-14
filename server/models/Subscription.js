const mongoose = require('mongoose')

const subSchema = mongoose.Schema({
	endpoint: { type: String },
	key_p256dh: { type: String },
	key_auth: { type: String },
	name: { type: String },
	room: { type: String }
})

module.exports = mongoose.model('subModel', subSchema)