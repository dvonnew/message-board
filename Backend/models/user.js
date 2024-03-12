const mongoose = require("mongoose")
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose")

const Session = new Schema({
    refreshToken: { type: String, default: ""}
})

const User = new Schema ({
    first_name: { type: String, required: true, default: "" },
    last_name: { type: String, required: true, default: "" },
    email: { type: String, required: true, default: "" },
    membershipStatus: { type: String, default: "free" },
    favorites: { type: Array, required: true, default: []},
    upvoted_posts: {type: Array, required: true, default: []},
    authStrategy: {type: String, default: "local"},
    refreshToken : { type: [Session]},
    joined_date: {tpe: Date},
    birth_date: {type: Date}
})

User.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.refreshToken
        return ret
    }
})

//Virtual to combine the users first and last name into one
User.virtual("name").get(function() {
    return  `${this.first_name} ${this.last_name}`
})

User.virtual("url").get(function() {
    return `/users/${this._id}`
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", User)