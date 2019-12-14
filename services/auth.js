const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../models/Users');

var authService = {
    signUser: function (user) {
        const token = jwt.sign({
            username: user.username,
            _id: user._id
        }, 'secretKey',
            {
                expiresIn: '1h'
            });
        return token
    },
    verifyUser: function (token) {
        try {
            let decoded = jwt.verify(token, 'secretKey');
            return user.findById(decoded._id);
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    hashPassword: function (plaintextPassword) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(plaintextPassword, salt);
        return hash;
    },
    comparePasswords: function (plaintextPassword, hashPassword) {
        return bcrypt.compareSync(plaintextPassword, hashPassword)
    }
}

module.exports = authService;