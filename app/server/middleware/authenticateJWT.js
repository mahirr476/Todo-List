const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // [1] accesses the second part of the split array, which is the token itself

    if(!token) {
        return res.sendStatus(403);
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateJWT;