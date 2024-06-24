// auth.js
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const User = require('./models/user.models');
const jwt = require('jsonwebtoken');

// Bearer Strategy for token authentication
passport.use(new BearerStrategy(
    async (token, done) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (!user) return done(null, false);
            done(null, user);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return done(null, false, { message: 'Token expirado' });
            }
            return done(error, false);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});
