const mongoose = require("mongoose")

const Schema = mongoose.Schema

//Create Topic Schema
const TopicSchema = new Schema ({
    name: { type:String, required: true },
    admin: [{type: Schema.Types.ObjectId, required: true }]
})

TopicSchema.virtual("url").get(function(){
    return `/t/${this.name}`
})

module.exports = mongoose.model("Topic", TopicSchema)