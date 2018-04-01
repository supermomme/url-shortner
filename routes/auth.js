var config = require('config')
var express = require('express')
var passport = require('passport')
var User = require('../models/user')
var router = express.Router()

router.get('/register', (req, res) => {
	if(req.isAuthenticated()) return req.redirect('/admin')
	res.render('auth/register', { })
})

router.post('/register', (req, res) => {
	User.register(new User({ username : req.body.username }), req.body.password, (err, user) => {
    if (err) return res.render('auth/register', { user })
    passport.authenticate('local')(req, res, () => res.redirect('/admin'))
	})
})

router.get('/login', (req, res) => {
	if(req.isAuthenticated()) return req.redirect('/admin')
	res.render('auth/login')
})

router.get('/login/failed', (req, res) => {
	if(req.isAuthenticated()) return req.redirect('/admin')
	res.render('auth/loginFailed')
})

router.post('/login', passport.authenticate('local', {
	successRedirect: '/admin',
	failureRedirect: '/admin/login/failed'
}))

router.get('/logout', (req, res) => {
	if(!req.isAuthenticated()) return req.redirect('/admin/login')
	req.logout()
	res.redirect('/admin')
})


module.exports = router