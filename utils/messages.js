const moment = require('moment-timezone')

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().tz('Asia/Kolkata').format('LT')
    };
}

module.exports = formatMessage;