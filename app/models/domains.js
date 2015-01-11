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
    domain_name: {
        type: String,
        required: true,
        unique: true
    },
    popups: [{
        title: {
            type: String,
            trim: true
        },
        cta1: {
            type: String,
            trim: true
        },
        cta2: {
            type: String,
            trim: true
        },
        events: [],
        default_tags: [{
            type: Schema.ObjectId,
            ref: 'Tag'
        }],
        blocks: [{
            type: {
                type: String
            },
            title: {
                type: String
            },
            select_options: [{
                option: {
                    type: String
                },
                tag: {
                    type: Schema.ObjectId,
                    ref: 'Tag'
                }
            }]
        }]
    }]
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