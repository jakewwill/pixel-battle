var LocalStrategy = require('passport-local').Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = function(passport) {
    // Used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });
    
    // Deal with signups
    passport.use(
        'local-signup',
        new LocalStrategy({
            emailField : 'email',
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                }
                var newUserMysql = {
                    email: req.body.email,
                    username: username,
                    password: bcrypt.hashSync(password, null, null),
                    admin: 0
                };

                var insertQuery = "INSERT INTO users ( email, username, password, admin ) values (?,?,?,?)";

                connection.query(insertQuery,[newUserMysql.email, newUserMysql.username, newUserMysql.password, newUserMysql.admin], function(err, rows) {
                    newUserMysql.id = rows.insertId;

                    return done(null, newUserMysql);
                });
                
            });
        })
    );

    // Deal with login
    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM users WHERE email = ?",[req.body.email], function(err, rows){
                if (err)
                    return done(err);

                if (!rows.length) 
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash                

                // If the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // All is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
};