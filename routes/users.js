var config = require('config')
var express = require('express')
var User = require('../models/user')
var router = express.Router()
var passport = require('passport')

router.get('/', (req, res) => {
  if(!req.isAuthenticated() || !req.user.isAdmin) {
    return res.render('failed', {
      title: 'Nicht Autenfiziert!',
      message: 'Du must dich angemeldet haben und ein Administrator sein um diese Seite besuchen zu können.'
    })
  }
  User.find()
  .then((data) => {
    res.render('users/list', { users: data, isAdmin: req.user.isAdmin, title: config.pageTitle + ' | Benutzer Liste' })
  })
  .catch((error) => {
    res.render('error', { message: 'Irgendetwas ist schief gelaufen!', error, title: config.pageTitle + ' | Fehler'})
  })
})

router.get('/create', (req, res) => {
  if(!req.isAuthenticated() || !req.user.isAdmin) {
    return res.render('failed', {
      title: 'Nicht Autenfiziert!',
      message: 'Du must dich angemeldet haben und ein Administrator sein um diese Seite besuchen zu können.'
    })
  }
  res.render('users/create', { isAdmin: req.user.isAdmin, title: config.pageTitle + ' | Benutzer Erstellen' })
})

router.post('/create', (req, res) => {
  if(!req.isAuthenticated() || !req.user.isAdmin) {
    return res.render('failed', {
      title: 'Nicht Autenfiziert!',
      message: 'Du must dich angemeldet haben und ein Administrator sein um diese Seite besuchen zu können.'
    })
  }
	User.register(new User({ username : req.body.username, isAdmin: req.body.isAdmin }), req.body.password, (error, user) => {
    if (error && error.name === 'UserExistsError') return res.render('users/createFailed', {
      username: req.body.username,
      title: config.pageTitle + ' | Benutzer Erstellen'
    })
    if (error) return res.render('error', { message: error.msg, error })
    res.render('users/createSuccess', {
      username: req.body.username,
      password: req.body.password,
      isCreatedUserAdmin: req.body.isAdmin,
      isAdmin: req.user.isAdmin,
      title: config.pageTitle + ' | Benutzer Erstellen'
    })
	})
})

router.post('/delete', (req, res) => {
  if(!req.isAuthenticated() || !req.user.isAdmin) {
    return res.render('failed', {
      title: 'Nicht Autenfiziert!',
      message: 'Du must dich angemeldet haben und ein Administrator sein um diese Seite besuchen zu können.'
    })
  }
  User.findByIdAndRemove(req.body.userId, (error, user) => {
    if (error) return res.render('error', { message: error.msg, error })
    res.render('users/deleteSuccess', { title: config.pageTitle + ' | Benutzer Löschen', username: user.username })
  })
})

module.exports = router