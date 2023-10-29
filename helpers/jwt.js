const jwt = require('jsonwebtoken')

const secretKey = 'rakamin';

module.exports = {
    generateToken: (payload) => {
        return jwt.sign(payload, secretKey, { expiresIn: '1h' })
    },
    verifyToken: (token) => {
        try {
            return jwt.verify(token, secretKey);
        } catch (error) {
            return null;
        }
    }
}
