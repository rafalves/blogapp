const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;