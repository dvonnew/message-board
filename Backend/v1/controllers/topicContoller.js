const Topic = require('../../models/topic')
const Post = require('../../models/post')
const User = require('../../models/user')
const async = require("async")
const { body, validationResult } = require('express-validator')

//CREATE TOPIC PAGE

//GET Create Topic
exports.create_topic_get = (req, res, next) => {
    res.render('create_topic_form', {title: 'Start a new Topic'})
}

//POST Create Topic
exports.create_topic_post = [
    body('name', 'Please enter a name').trim().escape().custom(async (value, {req}) => {
        const topic = await Topic.findOne({name: value})
        if (topic) {
            return Promise.reject('Topic already exists')
        }
    }),

    (req, res, next) => {
        
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            res.render("create_topic_form", {
                title: "Start a new Topic",
                errors: errors.array()
            })
            return
        }

        //Success
        const topic = new Topic({
            name: req.body.name.toLowerCase(),
            admin: req.user
        })

        topic.save((err) => {
            if (err) {
                return next(err)
            }
            res.redirect(topic.url)
        })
    }
]

//GET Topics Page
exports.topic_get = (req,res, next) => {
    async.parallel(
        {
            topic(callback) {
                Topic.find({name: req.params.name}).exec(callback)
            },
            admin(callback) {
                Topic.find({ admin: req.user}).exec(callback)
            },
            sidebar_topics(callback) {
                Topic.find().exec(callback)
            }
        },
        (err, results) => {
            if(req.params.name==='all') {
                Post.find().limit((15)).exec((err, posts) => {
                    if(err) {
                        return next(err)
                    }
                    //Success
                    res.render("topic_page", {
                        title: results.topic[0].name,
                        posts: posts,
                        user: req.user,
                        admin: results.admin,
                        topic: results.topic,
                        sidebar_topics: results.sidebar_topics
                        
                    })
                })
            }

            else{
                Post.find({topic: results.topic[0]._id}).limit((15)).exec((err, posts) => {
                    if(err) {
                        return next(err)
                    }
                    //Success
                    
                    res.render("topic_page", {
                        title: results.topic[0].name,
                        posts: posts,
                        user: req.user,
                        admin: results.admin,
                        topic: results.topic,
                        sidebar_topics: results.sidebar_topics
                        
                    })
                })
            }
        }
    )
}

//ADMIN Controllers
exports.get_admin_settings_page = (req,res,next) => {
    res.render("admin_settings", {
        title: "Admin Settings"
    })
}
