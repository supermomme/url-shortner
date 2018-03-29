var config = require('config')
var express = require('express')
var passport = require('passport')
var User = require('../models/user')
var router = express.Router()
var Url = require('../models/url.js')

router.get('/', (req, res) => {
  if(!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  Url.find()
  .then((data) => {
    res.render('url/list', { urls: data, host: config.host, isAdmin: req.user.isAdmin })
  })
  .catch((error) => {
    res.render('error', { message: 'Fehler!', error})
  })
})

router.get('/create', (req, res) => {
  if(!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  res.render('url/create', { host: config.host, isAdmin: req.user.isAdmin })
})

router.post('/create', (req, res) => {
  if(!req.isAuthenticated()) {
    return res.render('failed', {
      title: 'Nicht Autenfiziert!',
      message: 'Du must dich angemeldet haben um kurze URLs erstellen zu können.'
    })
  }
  Url.create({
    longUrl: req.body.longUrl,
    shortUrlId: req.body.shortUrlId
  })
  .then((data) => {
    res.render('url/createSuccess', {
      shortUrl: 'http://test.de/'+data.shortUrlId,
      longUrl: data.longUrl
    })
  })
  .catch((error) => {
    res.render('error', { message: 'Irgendetwas ist schief gelaufen!', error})
  })
})

router.get('/users', (req, res) => {
  if(!req.isAuthenticated() || !req.user.isAdmin) {
    return res.redirect('/')
  }
  User.find()
  .then((data) => {
    console.log(data)
    res.render('users/list', { users: data, isAdmin: req.user.isAdmin })
  })
  .catch((error) => {
    res.render('error', { message: 'Irgendetwas ist schief gelaufen!', error})
  })
})

module.exports = router