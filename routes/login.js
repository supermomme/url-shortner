var config = require('config')
var express = require('express')
var passport = require('passport')
var User = require('../models/user')
var router = express.Router()

router.get('/', (req, res) => {
	if(req.isAuthenticated()) return req.redirect('/admin')
	res.render('auth/login', { title: config.pageTitle + ' | Login', currentUser: req.user })
})

router.post('/', passport.authenticate('local', {
	successRedirect: '/admin',
	failureRedirect: '/admin/login/failed'
}))

router.get('/failed', (req, res) => {
	if(req.isAuthenticated()) return req.redirect('/admin')
	res.render('auth/loginFailed', { title: config.pageTitle + ' | Login', currentUser: req.user })
})


module.exports = router