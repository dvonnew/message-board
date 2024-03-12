const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DateTime } = require("luxon")

const CommentSchema = new Schema ({
    body: { type: String, required: true},
    comment_date: { type: Date, required: true },
    modified_date: { type: Date, required: true },
    author: {type: Schema.Types.ObjectId, required: true },
    post: { type: Schema.Types.ObjectId, required: true },
    score: { type: Number, default: 0}
})

CommentSchema.virtual("comment_date_formatted").get(function () {
    return this.post_date ? DateTime.fromJSDate(this.comment_date).toLocaleString(DateTime.DATETIME_MED) : ''
})

module.exports = mongoose.model("Comments", CommentSchema)