var config = require('config')
var express = require('express')
var User = require('../models/user')
var router = express.Router()

router.get('/', (req, res) => {
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