const moment = require('moment-timezone')

function formatMessage(username, text, room) {
	let date = new Date()
	var y = date.toLocaleString('en-US', { month: '2-digit' })
	var x = date.toLocaleString('en-US', { day: '2-digit' })
	var z = date.getFullYear()
	var dateVal = x + "/" + y + "/" + z
	return {
		username,
		text,
		time: moment().tz('Asia/Kolkata').format('LT'),
		date: dateVal,
		room
	};
}

module.exports = formatMessage;