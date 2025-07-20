const mongoose = require('mongoose');

const dbURL = 'mongodb+srv://gedwardcoburn:iwpFfBMH60SzG2z5@songdb.fsqjhvh.mongodb.net/?retryWrites=true&w=majority&appName=SongDB';

mongoose.connect(dbURL);

module.exports = mongoose;