const User = require('../../../models/user')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")
const { body, validationResult } = require('express-validator')
const { getToken, getRefreshToken, COOKIE_OPTIONS, verifyUser} = require("../../../authorization")


exports.favorite_topic = [
    verifyUser,
    (req, res) => {
        User.updateOne(
            {_id: req.user._id},
            { $push: { favorites: req.body.topic }}
            ).exec((err, user) => {
                if(err) {
                    res.status(404).json({error: "Could not push favorite to user"})
                }
                User.findById(req.user._id).exec((err, user) => {
                    if (err) {
                        res.status(404).json({ error: 'Coul not push favorite to user'})
                    }
                    res.status(200)
                    res.send(user)
                })
            }
        )
    }
]

exports.unfavorite_topic = [
    verifyUser,
    (req, res) => {
        User.updateOne(
            { _id: req.user._id },
            { $pull: { favorites: req.body.topic }})
            .exec((err, user) => {
                if (err) {
                    res.status(404).json({error: "Could not unfavorite from topic"})
                }
                User.findById(req.user._id).exec((err, user) => {
                    if(err) {
                        res.status(404).json({error: 'Could not unfavorite topic'})
                    }
                    res.status(200)
                    res.send(user)
                })
            }
        )
    }
]

//SIGN-UP NEW PASSPORT
exports.signup = [
    body("username", "Username can not be empty").trim().isLength({min:1}).escape().custom(async (value, { req }) => {
        const user = await User.findOne({ username: value })
        if (user) {
            return Promise.reject("Username already exists")
        }
    }),
    //First Name
    body("first_name", "First name can not be empty").trim().isLength({min:1}),
    //LastName
    body("last_name", "Last name can not be empty").trim().isLength({min:1}).escape(),
    //Email
    body('email', 'Must be valid email').isEmail().custom(async (value, { req }) => {
        const email = await User.findOne({ email: value })
        if (email) {
            return Promise.reject("Email already in use with another user")
        }
    }),
    //Password
    body('password', 'Password must be entered').trim().isLength({min:6}).escape(),
    //Confirm Password
    body('confirm_password', 'Confirmation Password must be entered').trim().isLength({min:6}).custom((value, { req }) => {
        if(value !== req.body.password) {
            throw new Error("Confirmation password does not match")
        }
        return true
    }),

    (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(404).json({ errors: errors.array()})
        }
        User.register(
            new User({
                username: req.body.username,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                membershipStatus: "free",
                joined_date: new Date(),
                favorites: []
            }),
            req.body.password,
            (err, user) => {
                if (err) {
                    console.log("broke--")
                    console.log(err)
                    res.status(500)
                    res.send(err)
                } else {
                    const token = getToken({ _id : user._id})
                    const refreshToken = getRefreshToken({ _id : user._id })
                    user.refreshToken.push({refreshToken})
                    user.save((err, user) => {
                        if (err) {
                            console.log(err)
                            res.status(500).json({errors: err})
                        } else {
                            res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                            res.send({ success: true, token})
                        }
                    })
                }
            }
        )
        
    }

]

//LOGIN PASSPORT
exports.login = [
    passport.authenticate("local"),
    (req, res) => {
        const token = getToken({ _id: req.user._id })
        const refreshToken = getRefreshToken({ _id: req.user._id })
        User.findById(req.user._id).then(
            user => {
                user.refreshToken.push({ refreshToken })
                user.save((err, user) => {
                    if(err) {
                        res.status(400).json({error: err})
                    } else {
                        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                        res.send({ success: true, token, user })
                    }
                })
            }
        )
    }   
]

//LOGOUT
exports.logout = [
    verifyUser,
    (req, res, next) => {
        const { signedCookies = {} } = req
        const { refreshToken } = signedCookies
        User.findById(req.user._id). then(
            user => {
                const tokenIndex = user.refreshToken.findIndex(
                    item => item.refreshToken === refreshToken
                )

                if(tokenIndex !== -1) {
                    user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove()
                }

                user.save((err, user) => {
                    if (err) {
                        res.status(500).json({error: err})
                    } else {
                        res.clearCookie("refreshToken", COOKIE_OPTIONS)
                        res.send({ success: true})
                    }
                })
            },
            err => next(err)
        )
    }
]

//REFRESH TOKEN
exports.refresh = (req, res, next) => {
    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies

    if (refreshToken) { 
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            const userId = payload._id
            User.findById(payload._id).then(
                user => {
                    if (user) {
                        const tokenIndex = user.refreshToken.findIndex(
                            item => item.refreshToken === refreshToken
                        )

                        if (tokenIndex === -1) {
                            res.statusCode = 401
                            res.json("Unathorized")
                        } else {
                            const token = getToken({ _id: userId })

                            const newRefreshToken = getRefreshToken({ _id: userId })
                            user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken }
                            user.save((err, user) => {
                                if (err) {
                                    res.status(500).json({ error: err})
                                } else {
                                    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
                                    res.send({ success: true, token})
                                }
                            })
                        }
                    } else {
                        res.statusCode =401
                        res.json("Unauthorized")
                    }
                }
            )
        } catch (err) {
            res.statusCode = 401
            res.json("Unauthorized")
        }
    } else {
        res.statusCode = 401
        res.json("Unauthorized")
    }

}

//GET USER DETAIL
exports.get_user_detail = [
    verifyUser,
    (req, res, next) => {
        res.send(req.user)
    }
]

//UPDATE PROFILE
exports.update_user = [
    verifyUser, 
    body("first_name", "First name can not be empty").trim().isLength({min:1}),
    //LastName
    body("last_name", "Last name can not be empty").trim().isLength({min:1}).escape(),
    //Email
    body('email', 'Must be valid email').isEmail().custom(async (value, { req }) => {
        if (value === req.user.email) {
            return true
        }
        const email = await User.findOne({ email: value })
        if (email) {
            return Promise.reject("Email is already in use with another user")
        }
    }),
    (req, res) => {

        console.log('Ping')
        console.log(req.user)

        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(404).json({ errors: errors.array()})
        }

        console.log('PING')

        User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    birth_date: req.body.birth_date
                }
            }
        ).exec((err, user) => {
            if (err) {
                return res.status(404).json({ errors: {update: "Update Failed"}})
            }
            res.send(user)
        })
    }
]

//CHANGE PASSWORD
exports.change_password = [ 
    verifyUser,
    body("current_password").custom( async (value, {req}) => {
        if(!req.user) {
            throw new Error("Could not validate user")
        }
        return true
    }),
    body("new_password").trim().isLength({min:6}).escape().custom((value, {req}) => {
        if (value === req.body.current_password) {
            throw new Error("New password cannot match old password")
        }
        return true
    }),
    body("confirm_password").trim().isLength({min: 6}).escape().custom(( value, {req}) => {
        if (value !== req.body.new_password) {
            throw new Error ("Confirmation does not match confirmation")
        }
        return true
    }),
    (req, res) => {
        const errors = validationResult(req)
        // console.log(errors)

        if(!errors.isEmpty()) {
            return res.status(404).json({ errors: errors.array()}) 
        }

        
        User.findById(req.user._id).then(user => {
            if(!user) {
                return res.status(404).json({errors: 'could not find user'})
            }
            user.changePassword(req.body.current_password, req.body.new_password, function(err) {
                if (err) {
                    return res.status(404).json({msg: 'Incorrect Password'})
                }
                user.save()
                res.status(200).send(user)
            }) 
        })
            
    }
    
]

exports.delete_user = [
    verifyUser,
    (req,res) => {
        User.findByIdAndDelete(req.user._id).exec((err) => {
            if (err) {
                res.status(404).json({error: "Could not find User"})
            }
            res.status(204).json({status: "Success!"})
        })
    }
]
