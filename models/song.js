const db = require('../db');

const Song = db.model('Song', new db.Schema({
    title: { type: String, required: true },
    artist: String,
    popularity: { type: Number, min: 0, max: 10 },
    releaseDate: { type: Date, default: Date.now },
    genre: [String]
}));


module.exports = Song;