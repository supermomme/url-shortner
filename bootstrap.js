const mongoose = require('mongoose')
const config = require('config')
const User = require('./models/user.js')
const boxen = require('boxen');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const username = 'example'
const password = 'secret'
passport.initialize()
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
mongoose.connect(config.mongodb)
.then(res => User.register(new User({ username, isAdmin: true }), password))
.then((user) => {
	console.log(boxen(`User Registrated! Huray!\nYour Username: ${username}\n Your Password: ${password}`, {
		padding: 1,
		margin: 1,
		borderStyle: 'round',
		borderColor: 'green',
		float: 'center',
		backgroundColor: 'blue'
	}))
	process.exit()
})
.catch(err => {
	console.error(err)
	process.exit()
})