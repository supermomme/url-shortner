const clui = require('clui')
const Spinner = clui.Spinner
const clc = require('cli-color')
const Line = clui.Line
const mongoose = require('mongoose')
const config = require('config')
const User = require('./models/user.js')
const Url = require('./models/url.js')
const boxen = require('boxen');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const exampleData = {
	username: 'example',
	password: 'secret',
	longUrl: 'https://codeanker.de',
	shortUrlId: 'codeanker'
}
var outputCreateUrl = new Spinner('Creating Example URL', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
var outputCreateUser = new Spinner('Creating Example User', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
passport.initialize()
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
mongoose.connect(config.mongodb)
.then(() => outputCreateUrl.start())
.then(() => Url.create({
	longUrl: exampleData.longUrl,
	shortUrlId: exampleData.shortUrlId
}))
.then(() => {
	outputCreateUrl.stop()
	outputCreateUrl = new Line()
	.padding(2)
	.column('✔ Created Example URL', 30, [clc.green])
	.output()
	outputCreateUser.start()
})
.then(() => User.register(new User({ username: exampleData.username, isAdmin: true }), exampleData.password))
.then(user => {
	outputCreateUser.stop()
	outputCreateUser = new Line()
	.padding(2)
	.column('✔ Created Example User', 30, [clc.green])
	.output()
	console.log(boxen(`User Registrated! Huray!\nYour Username: ${exampleData.username}\n Your Password: ${exampleData.password}`, {
		padding: 1,
		margin: 1,
		borderStyle: 'round',
		borderColor: 'green',
		float: 'left',
		backgroundColor: 'blue'
	}))
})
.then(() => process.exit())
.catch(err => {
	console.error(err)
	process.exit()
})
