const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const JWTStrategy = require("passport-jwt").Strategy
const User = require('../../../models/user')


