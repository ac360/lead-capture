'use strict';

// Dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Utils = require('../lib/utils'),
    moment = require('moment'),
    crypto = require('crypto');

// Domain Schema
var DomainSchema = new Schema({
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    forms: {
        type: Schema.Types.Mixed,
        default: []
    }
});

DomainSchema.set('autoIndex', false);

/** 
 * Helpers
 */


/**
 * Middleware
 */


/**
 * Methods
 */


/** 
 * Statics
 */

DomainSchema.statics = {}; // DomainSchema.statics

mongoose.model('Domain', DomainSchema);


// end