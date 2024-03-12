const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { DateTime } = require("luxon")

const PostSchema = new Schema ({
    title: { type: String, required: true },
    body: { type: String, required: true },
    post_date: { type: Date, required: true },
    modified_date: { type: Date, required: true},
    user: { type: Schema.Types.ObjectId, required: true },
    topic: {type: Schema.Types.ObjectId, ref:"Topic", required: true},
    score: { type: Number, required: true}
})

//Formatted posted date virtual
PostSchema.virtual("post_date_formatted").get(function () {
    return this.post_date ? DateTime.fromJSDate(this.post_date).toLocaleString(DateTime.DATETIME_MED) : ''
})

PostSchema.virtual("url").get(function () {
    return `/posts/${this._id}`
})

module.exports = mongoose.model("Posts", PostSchema)