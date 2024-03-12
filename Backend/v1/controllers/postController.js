const Post = require('../../models/post')
const Topic = require('../../models/topic')
const { DateTime } = require("luxon")
const async = require("async")
const { body, validationResult } = require('express-validator')

//Create Post Form
exports.get_create_post_form = (req, res, next) => {
    Topic.find().exec((err, topics) => {
        if(err) {
            return next
        }
        res.render("create_post_form", {
            title: "Creat Post",
            topics: topics
        })
    }) 
}

exports.post_create_form = [
    body('topic', 'Please select a Topic!').trim().escape(),
    body('title', 'Title your post!').trim().isLength({min: 1, max: 40}).escape(),
    body('body', 'You gotta actually post something! Please fill out the body').trim().isLength({min:1, max: 2000}).escape(),

    (req, res, next) => {

        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            Topic.find().exec((err, topics) => {
                if(err) {
                    return next
                }
                res.render("create_post_form", {
                    title: "Creat Post",
                    topics: topics,
                    errors: errors
                })
            }) 
            return
        }

        //Success
        const post = new Post({
            topic: req.body.topic,
            title: req.body.title,
            body: req.body.body,
            user: req.user,
            post_date: new Date(),
            modified_date: new Date()
        })

        post.save((err) => {
            if(err) {
                return next(err)
            }

            res.redirect(post.url)
        })
    }
]

//Edit Post
exports.get_edit_post = (req, res, next) => {
    async.parallel(
        {
            post(callback){
                Post.findById(req.params.id).exec(callback)
            },
            topics(callback){
                Topic.find()
                .limit((7))
                .exec(callback)
            }
        },
        (err, results) => {
            if(err){
                console.log(req.params.id)
                return next(err)
            }
            if(results.post === null) {
                console.log(req.params.id)
                const err = new Error("Post not found!")
                err.status =404
                return next(err)
            }

            for (const topic in results.topics) {
                for (const postTopic in results.post.topic) {
                    if (topic._id === postTopic._id) {
                        topic.checked = 'true'
                    }
                }
            }
            res.render("create_post_form", {
                title: "Edit Your Post",
                topics: results.topics,
                post: results.post
            })
        }
    )
}

exports.post_edit_form = [

    body('topic', 'Please select a Topic!').trim().escape(),
    body('title', 'Title your post!').trim().isLength({min: 1, max: 40}).escape(),
    body('body', 'You gotta actually post something! Please fill out the body').trim().isLength({min:1, max: 2000}).escape(),

    (req,res,next) => {

        const errors = validationResult(req)

        const post = {
            title: req.body.title,
            body: req.body.body
        }

        if(!errors.isEmpty()) {
            Topic.find().exec((err, topics) => {
                if(err) {
                    return next
                }
                res.render("create_post_form", {
                    title: "Creat Post",
                    topics: topics,
                    post: post,
                    errors: errors
                })
            }) 
            return
        }

        Post.findByIdAndUpdate(req.params.id, 
            {$set : {title: req.body.title, 
            body: req.body.body, 
            modified_date: new Date()}}, 
            function(err, updatedPost) {
                if(err) {
                    return next(err)
                }

                res.redirect(updatedPost.url)
            })
    }
]
//Delete Post


//Get Post
exports.get_post = (req, res, next) => {
    Post.findById(req.params.id).exec((err, post) => {
        if (err) {
            return next(err)
        }

        res.render("post", {
            title: post.title,
            post: post,
            user: req.user
        })
    })
}