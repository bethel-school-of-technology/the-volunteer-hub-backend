const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = mongoose.Schema({
    userId: {
        type: ObjectId
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema);