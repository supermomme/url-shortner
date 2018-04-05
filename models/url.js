var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Url = new Schema({
    longUrl: String,
    shortUrlId: { type: String, unique: true },
    visits: { type: Number, default: 0 }
})

module.exports = mongoose.model('Url', Url);