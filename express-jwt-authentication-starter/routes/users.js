const mongoose = require('mongoose');
const router = require('express').Router();   
const User = mongoose.model('User');
const passport = require('passport');
const utils = require('../lib/utils');

// TODO
router.get('/protected', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.status(200).json({success:true, msg: 'you are authorized'})
});

// TODO
router.post('/login', function(req, res, next){
    User.findOne({username: req.body.username})
        .then((user) => {
            if(!user) {
                res.status(401).json({success: false, msg: 'could not find the user'})
            }

            const isValid = utils.validPassword(req.body.password, user.hash, user.salt)

            if(isValid) {
                const tokenObject = utils.issueJWT(user)
                res.status(200).json({success: true, user, token: tokenObject.token, expires: tokenObject.expiresIn})
            } else {
                res.status(401).json({success: false, msg: 'you entered wrong password'})
            }
        })
        .catch(err => next(err))
});

// TODO
router.post('/register', function(req, res, next){
    const saltHash = utils.genPassword(req.body.password)

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash, 
        salt
    })
    newUser.save()
        .then((user) => {
            const jwt = utils.issueJWT(user)
            res.json({success: true, user, token: jwt.token, expiresIn: jwt.expires})
        })
        .catch(err => next(err))
});

module.exports = router;