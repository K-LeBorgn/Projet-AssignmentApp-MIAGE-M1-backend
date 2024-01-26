let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UserSchema = Schema({
    id: Number,
    username: String,
    password: String,
    role: 'user' | 'admin'
});

module.exports = mongoose.model('User', UserSchema);