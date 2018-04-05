var config = require('config')
var express = require('express')
var passport = require('passport')
var Url = require('../models/url')
var router = express.Router()

router.get('*', (req, res, next) => {
	Url.findOne({shortUrlId: req.url.substring(1)})
	.then((data) => {
		if (data === null) return next()
		return Url.findByIdAndUpdate(data._id, { visits: data.visits + 1 })
		.then(data => res.redirect(data.longUrl))
	})
    .catch((error) => {
        res.render('error', { message: 'Fehler!', error})
    })
})


module.exports = router