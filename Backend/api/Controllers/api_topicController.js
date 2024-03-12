const Topic = require('../../models/topic')
const Post = require('../../models/post')
const async = require("async")
const { body, validationResult } = require('express-validator')
const { verifyUser } = require('../../authorization')
const User = require('../../models/user')

//CREATE TOPIC
exports.create_topic = [
    body('name', 'Please enter a name').trim().escape().custom(async (value, {req}) => {
        const topic = await Topic.findOne({name: value})
        if (topic) {
            return Promise.reject('Topic already exists')
        }
    }),

    (req, res) => {
        
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(405).json({errors: errors.array()})
        }

        //Success
        const topic = new Topic({
            name: req.body.name.toLowerCase(),
            admin: req.admin
        })

        topic.save((err, topic) => {
            if (err) {
                return res.status(404)
            }
            const data = topic
            res.json(data)
        })
    }
]

//FETCH GET Topics
exports.get_topic = (req, res) => {
    const data = {
        topic: '',
        posts: []
    }

    
    Topic.findOne({name: req.params.topicname}).exec((err, topic) => {
        if(topic === null) {
            return res.status(404).json({error: 'Topic Page Not Found'})
        }
        if(topic.name === 'all') {
            Post.find().limit((15)).exec((err, posts) => {
                if(err) {
                    return res.status(404).json({error: 'No Posts Found'})
                }
                
                data.topic = topic
                data.posts = posts
                res.json(data)
            })
        }
        else {
            Post.find({topic: topic._id}).exec((err, posts) => {
                if(err) {
                    return res.status(404).json({error: 'No Posts Found'})
                }
                data.topic = topic
                data.posts = posts
                res.json(data)
            })
        }
    })
}

exports.get_latest_posts = (req, res) => {

    const data = {
        topic: '',
        posts: []
    }

    Topic.findOne({name: "all"}).exec((err, topic) => {
        Post.find().sort({ modified_date: -1}).exec((err, posts) => {
            if (err) {
                return res.status(404).json({ error: 'No Posts Found'})
            }
            topic.name = 'Latest'
            data.topic = topic
            data.posts = posts
            res.json(data)
        })
    })
}

exports.get_popular_posts = (req, res) => {

    const data = {
        topic: '',
        posts: []
    }

    Topic.findOne({ name: 'all'}).exec((err, topic) => {
        Post.find().sort({ score: -1 }).exec((err, posts) => {
            if (err) {
                return res.status(404).json({ error: "No Posts Found"})
            }
            topic.name = 'Popular'
            data.topic = topic
            data.posts = posts
            res.json(data)
        })
    })
}

exports.get_nav_topic = (req, res, next) => {
    const data = []
    
    //Make sure we find All
    Topic.find()
    .limit(5)
    .sort(1)
    .exec((err, topic) => {
        if(err) {
            return res.status(404).json({error: 'Topic Page Not Found'})
        }
        data.push(topic)
        }) 
}

exports.get_user_favorites = [
    verifyUser,
    async (req, res) => {
        try {
            const topics = await Promise.all(
                req.user.favorites.map(async (favorite_id) => {
                    return await Topic.findById(favorite_id).exec()
                })
            )
            res.send(topics)
        } catch(error) {
            res.status(404).json({ error: "Couldn't find topic"})
        }
    }
]

