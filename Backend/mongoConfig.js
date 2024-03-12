const process = require('node:process')
require('dotenv').config()
const mongoose = require('mongoose')

const mongoDB = process.env.MONGO_KEY

mongoose.connect(mongoDB, { useNewUrlParser: true })
const db = mongoose.connection
db.on("error", console.error.bind(console, "mongo connection error"))