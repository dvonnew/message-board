const Topic = require('../../models/topic')
const Post = require('../../models/post')
const User = require('../../models/user')
const Comment = require('../../models/comment')
const { verifyUser } = require('../../authorization')
const { body, validationResult} = require('express-validator')


exports.create_post = [
    verifyUser,
    body("topic", "Please select a Topic.").trim().isLength({min:1}).escape(),
    body("title", "Please enter a post title").trim().isLength({min:1}).escape(),
    body("body", "You have to actually have something to post!").trim().isLength({min:1}).escape(),

    (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(405).json({ errors: errors.array()})
        }

        const newPost = new Post({
            topic: req.body.topic,
            title: req.body.title,
            body: req.body.body,
            user: req.user,
            post_date: new Date(),
            modified_date: new Date(),
            score: 0
        })

        newPost.save((err, post) => {
            if(err) {
                return res.status(404)
            }     
            const data = post
            res.json(data)
        })
    }
]

exports.edit_post = [
    verifyUser,
    body("title", "Please enter a post title").trim().isLength({min:1}).escape(),
    body("body", "You have to actually have something to post!").trim().isLength({min:1}).escape(),

    (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(405).json({ errors: errors.array()})
        }

        Post.findByIdAndUpdate(req.params.id, 
            { $set : {
                title: req.body.title, 
                body: req.body.body, 
                modified_date: new Date()
            }}, 
            function(err, updatedPost) {
                if(err) {
                    return next(err)
                }

                res.json(updatedPost)
        })
    }
]

exports.like_post = [
    verifyUser,
    (req, res) => {
        Post.updateOne(
            {_id: req.body.post},
            { $inc : { score: 1}}
        ).exec((err, post) => {
            if (err) {
                res.status(404).json({error: "Could not find post"})
            }
            User.updateOne(
                { _id: req.user._id},
                { $push: { upvoted_posts: req.body.post }}
            ).exec((err, user) => {
                if(err) {
                    res.status(404).json({error: "Could not find user"})
                }
               
                Post.findById(req.body.post).exec((err, post) => {
                    if(err) {
                        res.status(404).json({ error: "Could not find Post"})
                    }
                    User.findById(req.user._id).exec((err, updatedUser) => {
                        if(err) {
                            res.status(404).json({ error: "Could not find user"})
                        }
                        const data = {
                        post: post,
                        user: updatedUser
                        }
                        res.status(200)
                        res.send(data)
                    })
                    
                })
            })
        })
    }
]

exports.unlike_post = [
    verifyUser,
    (req, res) => {
        Post.updateOne(
            {_id: req.body.post},
            { $inc: { score: -1}}
        ).exec((err, post) => {
            if (err) {
                res.status(404).json({error: "Could not find post"})
            }
            User.updateOne(
                { _id: req.user._id},
                { $pull: { upvoted_posts: req.body.post }}
            ).exec((err, user) => {
                if(err) {
                    res.status(404).json({error: "Could not find user"})
                }
                Post.findById(req.body.post).exec((err, post) => {
                    if(err) {
                        res.status(404).json({ error: "Could not find Post"})
                    }
                    User.findById(req.user._id).exec((err, updatedUser) => {
                        if(err) {
                            res.status(404).json({ error: "Could not find user"})
                        }
                        const data = {
                            post: post,
                            user: updatedUser
                        }
                        res.status(200)
                        res.send(data)
                    })
                })
            })
        })

    }
]

exports.delete_post = (req, res) => {
    
    Post.findByIdAndDelete(req.params.id).exec((err) => {
        if(err) {
            res.status(404).json({error: "Could not find Post"})
        }
        res.status(204).json({status: "success"})
    })
}

exports.get_post = (req, res, next) => {

    Post.findById(req.params.id).exec((err, post) => {
        if(err) {
            return res.status(404).json({error: "Oh no! ...Post could not be found"})
        }
        Comment.find({ post: req.params.id }).exec((err, comments) => {
            if(err) {
                return res.status(404).json({ error: "Oh no! ... No comments could be found"})
            }
            const data = {
                post: post,
                comments: comments
            }
            console.log(comments)
            res.status(200)
            res.json(data)
        })
    })
}

//FETCH GET ALL TOPICS FOR POST CREATION
exports.get_all_topics = (req, res, next) => {
    const data = {
        topics: [],
    }

    Topic.find().sort({name: 1}).exec((err, topics) => {
        if(err) {
            
            return res.status(404).json({error: "No Topics Found"})
        }
        data.topics = topics
        res.json(data)
    })
}