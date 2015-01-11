// Module dependencies.
var mongoose = require('mongoose'),
    url = require('url'),
    _ = require('lodash'),
    User = mongoose.model('User'),
    Domain = mongoose.model('Domain'),
    Tag = mongoose.model('Tag'),
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
    if (!req.session.user) return res.status(401).json({
        error: "Unauthorized"
    })
    return next();
};

/**
 * Render Either Home Page or Dashboard Page If User is Logged In
 */

var index = function(req, res) {
    if (req.session.user) {
        res.render('dashboard', variables);
    } else {
        res.render('home', variables);
    }
};

var preview = function(req, res) {
    if (req.session.user) {
        variables.domain = req.params.domain;
        res.render('preview', variables);
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
    if (!req.body.email || !req.body.password) return res.status(400).json({
        error: 'Missing required fields'
    });
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
                if (error.err.indexOf('email') > -1) return res.status(409).json({
                    error: 'Email already registered'
                });
            } else {
                return res.status(500).json({
                    error: error
                });
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
        if (error) return res.status(500).json({
            error: error
        });
        if (!user) return res.status(404).json({
            error: 'User not found'
        });
        // Check Password
        if (!user.authenticate(req.body.password)) res.status(401).json({
            error: 'Unauthorized'
        });
        // Save Session & Redirect
        req.session.user = user;
        return res.redirect('/');
    });
};



// -------------- DOMAINS


/**
 * List Domains
 */

var listDomains = function(req, res, next) {
    var populateQuery = [{
        path: 'popups.default_tags',
        select: '_id tag'
    }, {
        path: 'popups.blocks.select_options.tag',
        select: '_id tag'
    }];
    // Find Domains
    Domain.find({
        user: req.session.user._id
    }).populate(populateQuery).sort({
        created: -1
    }).exec(function(error, domains) {
        if (error) return res.status(500).json({
            error: error
        });
        res.json(domains);
    });
};

/**
 * Create Domain
 */

var createDomain = function(req, res, next) {
    var domain = new Domain(req.body);
    // Format URL
    domain.domain_name = domain.domain_name.replace('http://', '').replace('http://', '').replace('www.', '').toLowerCase();
    if (domain.domain_name.indexOf('/') > -1) domain.domain_name = domain.domain_name.split('/')[0];
    if (domain.domain_name.indexOf('?') > -1) domain.domain_name = domain.domain_name.split('?')[0];
    // Add User
    domain.user = req.session.user._id;
    // Save
    domain.save(function(error, response) {
        if (error) return res.status(500).json({
            error: error
        });
        res.json(response);
    });
};

/**
 * Save Domain
 */

var saveDomain = function(req, res, next) {
    Domain.find({
        _id: req.body._id,
        user: req.session.user._id
    }).limit(1).exec(function(error, domains) {
        if (error) return res.status(500).json({
            error: error
        });
        if (!domains.length) return res.status(404).json({
            error: "Domain not found"
        });

        var domain = domains[0];

        // Sanitize New Data
        // Reduce Tag Objects To Their IDs
        for (i = 0; i < req.body.popups.length; i++) {

            // Sanitze Default Tags
            for (j = 0; j < req.body.popups[i].default_tags.length; j++) {
                req.body.popups[i].default_tags[j] = req.body.popups[i].default_tags[j]._id;
            };

            // Iterate Through Pop-Up Form Fields
            for (j = 0; j < req.body.popups[i].blocks.length; j++) {
                if (req.body.popups[i].blocks[j].type === 'select') {
                    // Iterate Through Select Field Options & Sanitize Each Tag
                    for (k = 0; k < req.body.popups[i].blocks[j].select_options.length; k++) {
                        if (req.body.popups[i].blocks[j].select_options[k].tag) req.body.popups[i].blocks[j].select_options[k].tag = req.body.popups[i].blocks[j].select_options[k].tag._id;
                    };
                }
            };
        };

        // Update Domain
        domain.domain = req.body.domain;
        domain.popups = req.body.popups;

        // Save Domain
        domain.save(function(error, response) {
            if (error) return res.status(500).json({
                error: error
            });
            res.json(response);
        });
    })
};

/**
 * Destroy Domain
 */

var destroyDomain = function(req, res, next) {
    Domain.findOne({
        domain_name: req.params.domain_name,
        user: req.session.user._id
    }).exec(function(error, record) {
        console.log(error, record)
        if (error) return res.status(500).json({
            error: error
        });
        if (!record) return res.status(404).json({
            error: 'Domain not found'
        });
        record.remove(function(error, response) {
            if (error) return res.status(500).json({
                error: error
            });
            res.json({
                _id: response._id,
                message: "Domain sucessfully deleted"
            });
        });
    });
};


// -------------- TAGS

/**
 * List Tags
 */

var listTags = function(req, res, next) {
    Tag.find({
        user: req.session.user._id
    }).exec(function(error, tags) {
        if (error) return res.status(500).json({
            error: error
        });
        res.json(tags);
    });
};


/**
 * Save Tag
 */

var saveTag = function(req, res, next) {
    // Add User
    req.body.user = req.session.user._id;

    // Check If New Or Existing Tag
    if (!req.body._id) {
        // Create New Tag
        var tag = new Tag(req.body);
        // Save
        tag.save(function(error, response) {
            if (error) return res.status(500).json({
                error: error
            });
            res.json(response);
        });
    } else {
        // Update Existing Tag
        var tag = req.body;
        Tag.update({
            _id: tag._id
        }, {
            tag: tag.tag
        }, function(error, tag) {
            if (error) return res.status(500).json({
                error: error
            });
            res.json(response);
        });
    }
};


/**
 * Delete Tag
 */

var destroyTag = function(req, res, next) {
    // Find Tag
    Tag.find({
        _id: req.params.tagID,
        user: req.session.user._id
    }).limit(1).exec(function(error, tags) {
        if (error) return res.status(500).json({
            error: error
        });
        if (!tags) return res.status(404).json({
            error: 'Tag Not Found'
        });
        var tag = tags[0];
        // Delete Tag
        tag.remove(function(error, response) {
            res.json(response);
        });
    });
};



module.exports = {
    index: index,
    preview: preview,
    checkSession: checkSession,
    signup: signup,
    signin: signin,
    logout: logout,
    listDomains: listDomains,
    createDomain: createDomain,
    saveDomain: saveDomain,
    destroyDomain: destroyDomain,
    listTags: listTags,
    saveTag: saveTag,
    destroyTag: destroyTag
};

// End