const Sequelize = require('sequelize')
const db = require('../config/db')

const subSchema = db.define('sub', {
	endpoint: {
		type: Sequelize.STRING
	},
	key_p256dh: {
		type: Sequelize.STRING
	},
	key_auth: {
		type: Sequelize.STRING
	},
	name: {
		type: Sequelize.STRING
	},
	room: {
		type: Sequelize.STRING
	}
})

subSchema.sync()
	.then(console.log('Subscription Table has been created!!'))
	.catch(err => console.log('Subscription Table creation failed!!'))

module.exports = subSchema