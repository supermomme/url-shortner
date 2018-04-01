var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Url = new Schema({
    longUrl: String,
    shortUrlId: { type: String, unique: true }
})

module.exports = mongoose.model('Url', Url);