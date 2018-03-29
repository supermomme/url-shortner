var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Url = new Schema({
    longUrl: String,
    shortUrlId: String
})

module.exports = mongoose.model('Url', Url);