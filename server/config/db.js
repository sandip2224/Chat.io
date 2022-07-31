const Sequelize = require('sequelize')

const sequelize = new Sequelize('chatDB', process.env.USER, process.env.PASS, {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
})

sequelize.authenticate()
    .then(() => console.log(`Database Connected!`.cyan.underline.bold))
    .catch(err => console.error(`Database connection failed: ${err}`.red.underline))

module.exports = sequelize