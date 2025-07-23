const db = require('../db');

const userSchema = new db.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String }
});

const User = db.model('User', userSchema);

module.exports = User;

