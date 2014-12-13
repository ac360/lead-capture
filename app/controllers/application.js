// Module dependencies.
var mongoose = require('mongoose'),
    config = require('../../config/config');


// Variables to pass into the views using Jade templates
var variables = {
    connect_url: config.servant.connect_url,
    name: config.app.name,
    description: config.app.description,
    keywords: config.app.keywords,
    environment: process.env.NODE_ENV
};

/**
 * Render Either Home Page or Dashboard Page If User is Logged In
 */

var index = function(req, res) {
    variables.access_token = req.session.servant !== undefined ? req.session.servant.access_token : undefined;
    if (req.session.user) {
        res.render('dashboard', variables);
    } else {
        res.render('home', variables);
    }
};

/**
 * Log Out User & Redirect
 */
var logout = function(req, res) {
    // Destroy The Session, And Redirect
    req.session = null;
    res.redirect('/');
};

/**
 * LogIn
 */
var login = function(req, res) {
     if (req.body.password === 'temppassword') {
        req.session.user = { user: 'admin' };
        return res.redirect('/');
     } else {
        res.status(401).json({ error: 'Unauthorized'});
     }
};

/**
 * Handle Servant Authentication Callback
 */
var authenticationCallback = function(req, res) {
    // if (req.query.code) {
    //     // If AuthorizationCode was included in the parameters, Get Access Token via Servant-SDK
    //     Servant.exchangeAuthCode(req.query.code, function(error, tokens) {
    //         if (error) console.log(error);
    //         console.log("FETCHED ACCESS TOKEN: ", error, tokens);
    //         // Try Rereshing AccessToekn
    //         Servant.refreshAccessToken(tokens.refresh_token, function(error, tokens) {
    //             console.log("REFRESHED ACCESS TOKEN: ", error, tokens);
    //         });


    //         // Save User Data & API Tokens To Session (SSL Certificate Is Recommended For Production + Set Session Secure to 'true' in Server.js)
    //         req.session.servant = {
    //             user_id: tokens.user_id,
    //             access_token: tokens.access_token,
    //             access_token_limited: tokens.access_token_limited
    //         };
    //         res.redirect('/');
    //     }); // Servant Authentication Callback
    // } else if (req.query.refresh_token) {
    //     // If RefreshToken was included in the parameters, the User has already authenticated
    //     // Save User Data & API Tokens To Session (SSL Certificate Is Recommended For Production + Set Session Secure to 'true' in Server.js)
    //     req.session.servant = {
    //         user_id: req.query.user_id,
    //         access_token: req.query.access_token,
    //         access_token_limited: req.query.access_token_limited
    //     };


    //     // Expiriments
    //     Servant.getUserAndServants(req.query.access_token, function(error, records) {
    //         console.log(error, records);
    //         res.redirect('/');
    //     });



    // } else {
    //     console.log("Something went wrong with authorization");
    // }



    // // Fetch User's data from Servant & save user to your database
    // Servant.getUser({
    //  access_token: tokens.access_token
    // }, function(error, servantUser) {

    //  if (error) {
    //      console.log(error);
    //      return res.redirect('/');
    //  }

    //  // Search For User In Database
    //  User.findOne({
    //      servant_user_id: servantUser.user._id
    //  }).exec(function(error, appUser) {

    //      if (error) {
    //          console.log(error);
    //          return res.redirect('/');
    //      }

    //      // Function to save or update user
    //      var saveUser = function(servantUser, appUser, tokens, callback) {
    //          appUser.first_name = servantUser.user.first_name;
    //          appUser.last_name = servantUser.user.last_name;
    //          appUser.display_name = servantUser.user.display_name;
    //          appUser.email = servantUser.user.email;
    //          appUser.username = servantUser.user.username;
    //          appUser.servant_user_id = servantUser.user._id;
    //          appUser.servant_access_token = tokens.access_token;
    //          appUser.servant_refresh_token = tokens.refresh_token;
    //          appUser.save(function(error, savedUser) {
    //              if (error) return console.log(error);
    //              return callback(savedUser);
    //          });
    //      };

    //      if (!appUser) appUser = new User();

    //      // Function to save or update user
    //      saveUser(servantUser, appUser, tokens, function(savedUser) {
    //          // Save to session
    //          req.session.servant = {
    //              user_id: savedUser.servant_user_id,
    //              user: savedUser,
    //              access_token: tokens.access_token
    //          };
    //          return res.redirect('/');
    //      }); // saveUser()

    //  }); // User.findOne
    // }); // Servant.getUser
    // }); // Servant.exchangeAuthCode
}; // authenticationCallback



module.exports = {
    index: index,
    login: login,
    logout: logout,
    authenticationCallback: authenticationCallback
};

// End