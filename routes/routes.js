var express = require('express');
var mysql = require('mysql');
var dbconfig = require('../config/database');

module.exports = function(app, passport) {
	app.get('/', function(req, res) {
		// Save any passed messages, then set the session message to null
		var flashMessage = req.session.message;
		req.session.message = null;

		var connection = mysql.createConnection(dbconfig.connection);
		connection.query('USE ' + dbconfig.database);

		res.render('navbar-items/index.ejs', {
			message: flashMessage,
			user: req.user || null
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("Login attempt...");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }

        	res.redirect(req.get('referer'));
    	}
    );

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}

function isLoggedIn(req, res, next) {
	// If user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// If they aren't redirect them to the home page
	req.session.message = "Sorry, but you must log in";
	res.redirect('/');
}