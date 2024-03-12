const User = require('../../models/user')
const { body, validationResult } = require("express-validator")
require('dotenv').config()
const bcrypt = require("bcryptjs")
const { ObjectID, ObjectId } = require('bson')




//User detail page
exports.user_profile_get = (req, res, next) => {
    User.findById(req.params.id).exec((err, user) => {
        if(err) {
            return next(err)
        }
        res.render("user_profile", {
            title: `Welcome, ${user.name}`,
            user
        })
    })
}

//SIGN-UP
//Display User Sign-up form on GET
exports.user_sign_up_get = (req, res, next) => {
    res.render("user_sign_up_form", {title: "User Sign-up"})
}
//User Sign-up on POST 
exports.user_sign_up_post = [

    //Validate and Sanitize
    //Username
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

    (req, res, next) => {

        //extract errors
        const errors = validationResult(req)

        //user Object for failed validation
        const errorUser = new User ({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            admin: 'false',
            membershipStatus: "Free"
        })

        //Error
        if(!errors.isEmpty()) {
            
            res.render("user_sign_up_form", {
                title: "User Sign-up",
                user: errorUser,
                errors: errors.array(),
            })
            return
        }

        //Data is valid

        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) {
                return next(err)
            }
            //Create User Object

            let isAdmin = 'false'

            if(req.body.admin === process.env.ADMIN_KEY) {
                isAdmin = 'true'
            }

            const user = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                admin: isAdmin,
                membershipStatus: "Free"
            })
            user.save((err) => {
                if (err) {
                    return next(err)
                }

                //Success reroute
                res.redirect("/")
            })
        })
    }
]

//UPDATE PROFILE (Routes to Sign-up Form)
//GET
exports.user_update_get = (req, res, next) => {
    User.findById(req.params.id).exec((err, user) => {
        if(err) {
            return next(err)
        }
        res.render("user_update_form", {
            title: `User Update: ${user.username}`,
            user
        })
    })
}
//POST
exports.user_update_post = [
    //Validate and Sanitize
    body("first_name", "First name can not be empty").trim().isLength({min:1}),
    //LastName
    body("last_name", "Last name can not be empty").trim().isLength({min:1}).escape(),
    //Email
    body('email', 'Must be valid email').isEmail().custom(async (value, { req }) => {
        const email = await User.findOne({ email: value })
        if (value === email.email) {
            return true
        }
        if (value !== email.email && email) {
            return Promise.reject("Email is already in use with another user")
        }
    }),

    (req, res, next) => {
        //extract errors
        const errors = validationResult(req)

        //user Object for failed validation
        const errorUser = {
            last_name: req.body.last_name,
            first_name: req.body.first_name,
            email: req.body.email,
        }

        //Error
        if(!errors.isEmpty()) {
            
            res.render("user_update_form", {
                title: "User Sign-up",
                user: errorUser,
                errors: errors.array(),
            })
            return
        }

        //Success
        User.updateOne(
            {_id: req.params.id},
            {
                $set: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email
                }
            }
        ).exec((err) => {
            if(err) {
                return next(err)
            }
            res.redirect(`/users/${req.params.id}`)
        })
    }
]

//CHANGE PASSWORD (Routes to new Form)
//GET
exports.change_user_password_get = (req,res,next) => {
    User.findById(req.params.id).exec((err, user) => {
        if (err) {
            return next(err)
        }
        res.render("change_password_form", {
            title: "Change Password",
        })
    })
}

//POST
exports.change_user_password_post = [
    //Validate and Sanitize
    body("current_password").custom( async (value, {req}) => {
        search_id = new ObjectId(req.params.id)
        const user = await User.findOne({"_id": search_id})
        if(!user) {
            throw new Error("Could not validate user")
        }
        return true
    }),
    body("new_password").trim().isLength({min:6}).escape().custom((value, {req}) => {
        if (value === req.body.current_password) {
            throw new Error("New password cannot match Current Password")
        }
        return true
    }),
    body("confirm_password").trim().isLength({min:6}).escape().custom((value, {req}) => {
        if (value !== req.body.new_password) {
            throw new Error ("New password does not match confirmation")
        }
        return true
    }),

    (req, res, next) => {

        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            
            res.render("change_password_form", {
                title: "Change Password",
                errors: errors.array()
            })
            return
        }

        //Success
        bcrypt.hash(req.body.new_password, 10, (err, hashedPassword) => {
            if (err) {
                return next(err)
            }
            User.findById(req.user._id).exec(err, user => {
                if (err) {
                    return res.status(404).json({errors: "Could not find user to update"})
                }
                user.setPassword(hashedPassword => {
                    user.save()
                    res.status(200)
                    res.send(user)
                })
            })
            
        })
    }
]

//UPDATE MEMBERSHIP (Routes to new Form)

//DELETE PROFILE (Routes to new Form)
exports.delete_user_get = (req, res, next) => {
    res.render("user_delete_form", {title: "Delete User"})
}

exports.delete_user_post = [
    body("confirm_delete").trim().custom(async (value, {req}) => {
        const user = await User.findOne({ username: value })
        if (!user) {
            return Promise.reject("Username does not match")
        }
    }),
    (req, res, next) => {

        const errors = validationResult(req)

        if(!errors.isEmpty()) {

            res.render("user_delete_form", {
                title: "Delete User",
                errors: errors.array()
            })
            return
        }

        //SUCCESS
        User.findByIdAndRemove(req.params.id, (err) => {
            if(err) {
                return next(err)
            }
            res.redirect("/")
        })
    }
]


