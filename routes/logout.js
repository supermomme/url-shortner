var config = require('config')
var express = require('express')
var passport = require('passport')
var User = require('../models/user')
var router = express.Router()

router.get('/', (req, res) => {
	if(!req.isAuthenticated()) return req.redirect('/admin/login')
	req.logout()
	res.redirect('/admin')
})


module.exports = router