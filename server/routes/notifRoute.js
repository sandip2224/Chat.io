const router = require('express').Router()

router.post('/register-push-device', (req, res) => {
    console.log('Saving subscription...');
    subscription = req.body.subscription
    res.end()
})

module.exports = router