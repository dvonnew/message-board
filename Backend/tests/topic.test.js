const topic = require('../routes/topics')

const request = require('supertest')
const express = require('express')
const { deleteOne } = require('../models/user')
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use('/t', topic)

test("Create topic route works", done => {
    request(app)
        .get("/t/createtopic")
        .expect("Content-Type", "text/html; charset=utf-8")
        .expect(200, done) 
})