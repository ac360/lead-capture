// Module dependencies.
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	config = require('../../config/config');

// Instantiate Servant SDK depending on development environment
if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
	var Servant = require('servant-sdk-node')(process.env.SERVANT_CLIENT_ID, process.env.SERVANT_SECRET_KEY, 'Enter Your Production Callback URL Here', 0);
} else {
	var Servant = require('servant-sdk-node')(config.servant.client_id, config.servant.client_secret, 'http://localhost:8080/auth/servant/callback', 0);
}

// Render Either Home Page or Dashboard Page If User is Logged In
var index = function(req, res) {
	// Variables to pass into the views
	var variables = {
		connect_url: config.servant.connect_url,
		name: config.app.name,
		description: config.app.description,
		keywords: config.app.keywords,
		environment: process.env.NODE_ENV
	};
	variables.token = req.session.servant !== undefined ? req.session.servant.client_token : undefined;

	if (req.session.servant && req.session.servant.user_id) {
		res.render('dashboard', variables);
	} else {
		res.render('home', variables);
	}
};

// Log Out User & Redirect
var logout = function(req, res) {
	// Destroy The Session, And Redirect
	req.session = null;
	res.redirect('/');
};

// Handle Servant Authentication Callback
var authenticationCallback = function(req, res) {

	// ****** COOKIES-ONLY VERSION – Get Access Token via Servant-SDK
	// Servant.getAccessToken(req, function(error, tokens) {
	// 	if (error) {
	// 		console.log(error);
	// 		return res.redirect('/');
	// 	}
	// 	// Save User Data & API Tokens To Session (SSL Certificate Is Recommened For Production + Set Session Secure to 'true' in Server.js)
	// 	req.session.servant = {
	// 		user_id: tokens.user_id,
	// 		client_token: tokens.client_token
	// 	};

	// 	res.redirect('/');

	// });

	// ****** DATABASE VERSION – Get Access Token via Servant-SDK
	Servant.getAccessToken(req, function(error, tokens) {

		if (error) {
			console.log(error);
			return res.redirect('/');
		}

		// Fetch User's data from Servant & build a profile with it
		Servant.getUser({
			token: tokens.access_token
		}, function(error, servantUser) {

			if (error) {
				console.log(error);
				return res.redirect('/');
			}

			// Search For User In Database
			User.findOne({
				servant_user_id: servantUser.user._id
			}).exec(function(error, appUser) {

				if (error) {
					console.log(error);
					return res.redirect('/');
				}

				// Function to save or update user
				var saveUser = function(servantUser, appUser, tokens, callback) {
					appUser.first_name = servantUser.user.first_name;
					appUser.last_name = servantUser.user.last_name;
					appUser.display_name = servantUser.user.display_name;
					appUser.email = servantUser.user.email;
					appUser.username = servantUser.user.username;
					appUser.servant_user_id = servantUser.user._id;
					appUser.servant_access_token = tokens.access_token;
					appUser.servant_client_token = tokens.client_token;
					appUser.save(function(error, savedUser) {
						if (error) return console.log(error);
						return callback(savedUser);
					});
				};

				if (!appUser) appUser = new User();

				// Function to save or update user
				saveUser(servantUser, appUser, tokens, function(savedUser) {
					// Save to session
					req.session.servant = {
						user_id: savedUser.servant_user_id,
						user: savedUser,
						client_token: tokens.client_token
					};
					return res.redirect('/');
				}); // saveUser()
			}); // User.findOne
		}); // Servant.getUser
	}); // Servant.getAccessToken

}; // authenticationCallback

module.exports = {
	index: index,
	logout: logout,
	authenticationCallback: authenticationCallback
};