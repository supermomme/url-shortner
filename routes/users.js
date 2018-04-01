var config = require('config')
var express = require('express')
var User = require('../models/user')
var router = express.Router()

router.get('/', (req, res) => {
  if(!req.isAuthenticated() || !req.user.isAdmin) {
    return res.render('failed', {
      title: 'Nicht Autenfiziert!',
      message: 'Du must dich angemeldet haben und ein Administrator sein um diese Seite besuchen zu können.'
    })
  }
  User.find()
  .then((data) => {
    res.render('users/list', { users: data, isAdmin: req.user.isAdmin })
  })
  .catch((error) => {
    res.render('error', { message: 'Irgendetwas ist schief gelaufen!', error})
  })
})

module.exports = router