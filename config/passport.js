const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const opts = {};
opts.jwtFromRequest = req => {
   
    let token = null;
    if (req && req.headers && req.headers.authorization) {
        token = req.headers.authorization.replace('JWT ', ''); 
    }
    return token;
};
opts.secretOrKey = process.env.JWT_SECRET;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.log(err));
    }));
};
