var config = require('config')
var express = require('express')
var User = require('../models/user')
var router = express.Router()
var passport = require('passport')

router.get('/password', (req, res) => {
  if(!req.isAuthenticated()) {
    return res.render('failed', {
      title: 'Nicht Autenfiziert!',
      message: 'Du must dich angemeldet haben um diese Seite besuchen zu können.'
    })
  }
  res.render('settings/password', { isAdmin: req.user.isAdmin, title: config.pageTitle + ' | Passwort Ändern' })
})

router.post('/password', (req, res) => {
  if(!req.isAuthenticated()) {
    return res.render('failed', {
      title: 'Nicht Autenfiziert!',
      message: 'Du must dich angemeldet haben und ein Administrator sein um diese Seite besuchen zu können.'
    })
	}
	console.log(req.body)
	req.user.changePassword(req.body.oldPassword, req.body.newPassword)
	.then(res => {
		res.render('settings/passwordSuccess', { title: config.pageTitle })
	})
	.catch(err => {
		if (err.name === 'IncorrectPasswordError') return res.render('settings/passwordFailed', { title: config.pageTitle + ' | Passwort Ändern' })
		res.render('error', { error:err, title: config.pageTitle + ' | Fehler!' })
	})
})

module.exports = router