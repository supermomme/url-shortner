var config = require('config')
var express = require('express')
var passport = require('passport')
var User = require('../models/user')
var router = express.Router()

router.get('/', (req, res) => {
	if(req.isAuthenticated()) return req.redirect('/admin')
	res.render('auth/register', { })
})

router.post('/', (req, res) => {
	User.register(new User({ username : req.body.username }), req.body.password, (err, user) => {
    if (err) return res.render('auth/register', { user })
    passport.authenticate('local')(req, res, () => res.redirect('/admin'))
	})
})


module.exports = router