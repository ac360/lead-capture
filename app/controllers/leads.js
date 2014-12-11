// Module dependencies.
var mongoose = require('mongoose'),
    Helpers = require('../helpers'),
    Lead = mongoose.model('Lead'),
    request = require('request'),
    config = require('../../config/config');

/**
 * Capture Route
 *
 * Accepts a request body JSON object that contains data about the lead.
 *
 */
var capture = function(req, res) {

    /**
     * Validate Lead Data
     */
    req.body.domain = req.params.domain;
    // Check Lead Data Has Required Properties
    if (!req.body.email) {
        return res.status(400).json({
            error: 'An email address is required'
        });
    }
    // Check Email Is Formatted Correctly
    if (!Helpers.validateEmail(req.body.email)) {
        return res.status(400).json({
            error: 'Please enter a valid email address'
        });
    }

    /**
     * Check If Lead Already Exists In Database
     */
    Lead.find({
        email: req.body.email
    }).limit(1).exec(function(error, leads) {
        if (error) return res.status(500).json({
            error: error
        });

        // Lead Exists?
        if (leads[0]) return res.status(400).json({
            error: 'You are already on our list'
        });

        /**
         * Save Lead
         */
        var newLead = new Lead(req.body);
        newLead.save(function(error, lead) {
            if (error) return res.status(500).json({
                error: error
            });

            console.log(lead);

            // Render Success Message
            return res.json({
                success: "You've been successfully added to the list",
                lead: lead
            });
        });



        // Save Session Logic – May Be Useful Later
        // saveUser(servantUser, appUser, tokens, function(savedUser) {
        //     // Save to session
        //     req.session.servant = {
        //         user_id: savedUser.servant_user_id,
        //         user: savedUser,
        //         access_token: tokens.access_token
        //     };
        //     return res.redirect('/');
        // }); // saveUser()
    }); // User.findOne

}; // authenticationCallback




module.exports = {
    capture: capture
};

// End