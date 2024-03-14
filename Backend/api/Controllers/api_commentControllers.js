const Comment = require('../../models/comment')
const { verifyUser } = require('../../authorization')
const { body, validationResult } = require('express-validator')

exports.create_comment = [
    verifyUser,
    body("body", "You have to enter a comment.").trim().isLength({min:1}).escape(),

    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(405).json({ errors: errors.array()})
        }

        const newComment = new Comment ({
            body: req.body.body,
            author: req.user,
            post: req.body.post,
            comment_date: new Date(),
            modified_date: new Date(),
            score:0
        })

        newComment.save((err, comment) => {
            if(err) {
                return res.status(404)
            }
            const data = comment
            res.json(data)
        })
    }
]

exports.delete_comment = (req, res) => {
    Comment.findByIdAndDelete(req.params.id).exec((err) => {
        if(err) {
            res.status(404).json({error: "Could not find comment"})
        }
        res.status(204).json({ status: "success"})
    })

}

exports.get_comments = (req, res) => {
    Comment.find({ post: req.params.id}).exec((err, comments) => {
        if(err) {
            return res.status(404).json({ error: "Oh no! ...Post could not be found"})
        }
        res.json(comments)
        
    })
}