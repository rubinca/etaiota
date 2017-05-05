var express = require('express');
var router = express.Router();
var models = require('../models/models')
var User = models.User;

module.exports = function(passport) {
    // Add Passport-related auth routes here, to the router!
    router.get('/signup', function(req, res) {
    	res.render('signup')
    });
    router.post('/signup', function(req, res) {
    	if (req.body.username && req.body.password && (req.body.password == req.body.passwordRepeat)) {
    		var u = new User({
    			username: req.body.username,
    			password: req.body.password,
          isAdmin: false,
          isPrimaryAdmin: false,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber
    		}).save(function(err) {
    			if (err) {
    				res.status(400).send(err)
    			}
    			else {
    				res.redirect('/home')
    			}
    		})
    	}
    	else {
        console.log("wrong something")
    		res.redirect('/signup')
    	}
    })

    router.get('/login', function(req, res) {
    	res.render('login')
    })

    router.post('/login',
    	passport.authenticate('local'),
    	function(req, res) {
    		res.redirect('/home');
    	});

    router.get('/logout', function(req, res) {
    	req.logout();
    	res.redirect('/login')
    })

    return router;
}
