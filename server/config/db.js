const mongoose = require('mongoose')
require('dotenv').config({ path: './.env' })

const connectDB = async () => {
    let URI;
    if (process.env.NODE_ENV === 'dev') URI = process.env.MONGO_DEV_URI
    else URI = process.env.MONGO_PROD_URI
    const conn = await mongoose.connect(URI)
    console.log(`MongoDB ${process.env.NODE_ENV} cluster connected: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = connectDB