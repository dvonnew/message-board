const Topic = require('../../models/topic')
const Post = require('../../models/post')
const Comment = require('../../models/comment')
const async = require('async')

exports.search = (req, res) => {
    
    data = {
        topics: [],
        posts: [],
    }
    search_input = decodeURIComponent(req.query.search_input)
    async.parallel({
        one: function(callback){
            Topic.find({name: {$regex: new RegExp(search_input, 'i')}}).exec((err, topics) => {
                callback(null, topics)
            })
        },
        two: function(callback){
            Post.find(
                {$or: [{title: {$regex: new RegExp(search_input, 'i') }}, 
                {body: {$regex: new RegExp(search_input, 'i') }},
                ]},
            ).exec((err, posts) => {
                callback(null, posts)
            })
        },
    }, function (err, results) {
        if(err) {
            console.log(err)
            return res.status(404).json({error: "error in async query"})
        }
        data.topics = results.one
        data.posts = results.two
        res.status(200)
        res.send(data)
    })
}



