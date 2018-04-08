var config = require('config')
var express = require('express')
var passport = require('passport')
var User = require('../models/user')
var router = express.Router()
var Url = require('../models/url.js')

var frobiddenUrlIds = [
  'admin',
  'admin/login',
  'admin/create',
  'admin/users',
  'admin/users/create'
].concat(config.frobiddenUrlIds)

router.get('/', (req, res) => {
  if(!req.isAuthenticated()) return res.redirect('/admin/login')
  Url.find()
  .then((data) => {
    res.render('url/list', { urls: data, host: config.host, currentUser: req.user, title: config.pageTitle + ' | URL Liste' })
  })
  .catch((error) => {
    res.render('error', { message: 'Fehler!', error})
  })
})

router.get('/create', (req, res) => {
  if(!req.isAuthenticated()) {
    return res.render('failed', {
      title: 'Nicht Autenfiziert!',
      message: 'Du must dich angemeldet haben um diese Seite besuchen zu können.'
    })
  }
  res.render('url/create', { host: config.host, currentUser: req.user, title: config.pageTitle + ' | URL Erstellen' })
})

router.post('/create', (req, res) => {
  if(!req.isAuthenticated()) {
    return res.render('failed', {
      title: 'Nicht Autenfiziert!',
      message: 'Du must dich angemeldet haben um kurze URLs erstellen zu können.'
    })
  }
  if (frobiddenUrlIds.includes(req.body.shortUrlId)) {
    return res.render('url/createFailed', { shortUrl: `${config.host}/${req.body.shortUrlId}`, currentUser: req.user, title: config.pageTitle + ' | URL Erstellen' })
  }
  Url.create({
    longUrl: req.body.longUrl,
    shortUrlId: req.body.shortUrlId
  })
  .then((data) => {
    res.render('url/createSuccess', {
      shortUrl: `${config.host}/${data.shortUrlId}`,
      longUrl: data.longUrl,
      title: config.pageTitle + ' | URL Erstellen',
      currentUser: req.user
    })
  })
  .catch((error) => {
    if(error.code === 11000) return res.render('url/createFailed', {
      shortUrl: `${config.host}/${req.body.shortUrlId}`,
      currentUser: req.user,
      title: config.pageTitle + ' | URL Erstellen'
    })
    res.render('error', { message: 'Irgendetwas ist schief gelaufen!', error, title: config.pageTitle + ' | Fehler'})
  })
})

router.post('/delete', (req, res) => {
  if(!req.isAuthenticated()) {
    return res.render('failed', {
      title: 'Nicht Autenfiziert!',
      message: 'Du must dich angemeldet haben um diese Seite besuchen zu können.'
    })
  }

  Url.findByIdAndRemove(req.body.urlId, (error, url) => {
    if (error) return res.render('error', { message: error.msg, error })
    res.render('url/deleteSuccess', { title: config.pageTitle + ' | URL Löschen', url, host: config.host, currentUser: req.user })
  })
})

module.exports = router