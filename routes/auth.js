var config = require('config')
var express = require('express')
var passport = require('passport')
var User = require('../models/user')
var router = express.Router()

router.get('/register', (req, res) => {
	res.render('auth/register', { })
})

router.post('/register', (req, res) => {
	User.register(new User({ username : req.body.username }), req.body.password, (err, user) => {
    if (err) return res.render('auth/register', { user })
    passport.authenticate('local')(req, res, () => res.redirect('/'))
	})
})

router.get('/login', (req, res) => {
	res.render('auth/login', { user : req.user })
})

router.post('/login', passport.authenticate('local'), (req, res) => {
	res.redirect('/')
})

router.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
})


module.exports = router