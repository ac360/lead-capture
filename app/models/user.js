'use strict';

// Dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Utils = require('../lib/utils'),
    moment = require('moment'),
    crypto = require('crypto');

// User Schema
var UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        default: ''
    },
    salt: {
        type: String
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

UserSchema.set('autoIndex', false);

/** 
 * Helpers
 */


/**
 * Middleware
 */


/**
 * Methods
 */
// Hash User with Password
UserSchema.methods.hashUserPassword = function() {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
    return this;
};

// Hash Only Password
UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

// Authenticate User by checking password
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

/** 
 * Statics
 */

UserSchema.statics = {}; // UserSchema.statics

mongoose.model('User', UserSchema);


// end