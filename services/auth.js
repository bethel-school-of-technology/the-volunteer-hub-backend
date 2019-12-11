const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
    hashPassword: function (plaintextPassword) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(plaintextPassword, salt);
        return hash;
    },
}

module.exports = authService;