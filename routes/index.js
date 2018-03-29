var config = require('config')
var express = require('express')
var passport = require('passport')
var Account = require('../models/account')
var router = express.Router()
var Url = require('../models/url.js')

router.get('/', (req, res) => {
  if(!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  Url.find()
  .then((data) => {
    res.render('index', { urls: data, host: config.host, isAdmin: req.user.isAdmin })
  })
  .catch((error) => {
    res.render('error', { message: 'Fehler!', error})
  })
})

router.get('/create', (req, res) => {
  if(!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  res.render('createUrl', { host: config.host })
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
    res.render('createUrlSuccess', {
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
  Account.find()
  .then((data) => {
    console.log(data)
    res.render('users/list', { users: data })
  })
  .catch((error) => {
    res.render('error', { message: 'Irgendetwas ist schief gelaufen!', error})
  })
})

router.get('/register', (req, res) => {
  res.render('register', { })
})

router.post('/register', (req, res) => {
  Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
    if (err) return res.render('register', { account })
    passport.authenticate('local')(req, res, () => res.redirect('/'))
  })
})

router.get('/login', (req, res) => {
  res.render('login', { user : req.user })
})

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/')
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router