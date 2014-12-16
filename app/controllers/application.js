// Module dependencies.
var mongoose = require('mongoose'),
    url = require('url'),
    _ = require('lodash'),
    User = mongoose.model('User'),
    Domain = mongoose.model('Domain'),
    config = require('../../config/config');


// Variables to pass into the views using Jade templates
var variables = {
    connect_url: config.servant.connect_url,
    name: config.app.name,
    description: config.app.description,
    keywords: config.app.keywords,
    environment: process.env.NODE_ENV
};

var checkSession = function(req, res, next) {
    if (!req.session.user) return res.status(401).json({error: "Unauthorized"})
    return next();
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
 * Sign Up
 */
var signup = function(req, res, next) {
    // Check Required Params
    if (!req.body.email || !req.body.password) return res.status(400).json({ error: 'Missing required fields' });
    // Save User
    var user = new User();
    user.email = req.body.email;
    user.password = req.body.password;
    // Hash Password
    user = user.hashUserPassword();
    user.save(function(error, user) {
        // Check for Conflict
        if (error) {
            if (error.code && error.code === 11000) {
                if (error.err.indexOf('email') > -1) return res.status(409).json({ error: 'Email already registered' });
            } else {
                return res.status(500).json({ error: error });
            }
        }
        // Save Session & Redirect
        req.session.user = user;
        return res.redirect('/');
    }); // user.save
}; // signup


/**
 * Signin
 */
var signin = function(req, res, next) {
    User.findOne({
        email: req.body.email
    }).exec(function(error, user) {
        if (error) return res.status(500).json({ error: error });
        if (!user) return res.status(404).json({ error: 'User not found' });
        // Check Password
        if (!user.authenticate(req.body.password)) res.status(401).json({ error: 'Unauthorized'});
        // Save Session & Redirect
        req.session.user = user;
        return res.redirect('/');
    });
};

/**
 * List Domains
 */

var listDomains = function(req, res, next) {
    Domain.find({ user: req.session.user._id }).sort({ created: -1 }).exec(function(error, domains) {
        if (error) return res.status(500).json({ error: error });
        res.json(domains);
    });
};

/**
 * Create Domain
 */

var createDomain = function(req, res, next) {
    var domain = new Domain(req.body);
    // Format URL
    domain.domain = domain.domain.replace('http://', '').replace('http://', '').replace('www.', '').toLowerCase();
    if (domain.domain.indexOf('/') > -1) domain.domain = domain.domain.split('/')[0];
    if (domain.domain.indexOf('?') > -1) domain.domain = domain.domain.split('?')[0];
    // Add User
    domain.user = req.session.user._id;
    // Save
    domain.save(function(error, response) {
        if (error) return res.status(500).json({ error: error });
        res.json(response);
    });
};

/**
 * Save Domain
 */

var saveDomain = function(req, res, next) {
    Domain.findOne({ _id: req.body._id, user: req.session.user._id }).exec(function(error, domain) {
        if (error) return res.status(500).json({ error: error });
        if (!domain) return res.status(404).json({ error: "Domain not found" });

        domain = _.assign(domain, req.body);
        domain.save(function(error, response) {
            if (error) return res.status(500).json({ error: error });
            res.json(response);
        });
    })
};


module.exports = {
    index: index,
    checkSession: checkSession,
    signup: signup,
    signin: signin,
    logout: logout,
    listDomains: listDomains,
    createDomain: createDomain,
    saveDomain: saveDomain
};

// End