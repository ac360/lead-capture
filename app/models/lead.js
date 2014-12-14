// ****** DATABASE VERSION – USER Model – Use this if you are using a database

// Module dependencies.
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


// Lead Schema
var LeadSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        trim: true
    },
    full_name: {
        type: String,
        trim: true
    },
    first_name: {
        type: String,
        trim: true
    },
    last_name: {
        type: String,
        trim: true
    },
    tags: {
        type: Array,
        default: []
    },
    primary_activity: {
        type: String,
        trim: true
    },
    catalog_size: {
        type: String,
        trim: true
    },
    experience: {
        type: String,
        trim: true
    },
    domain: {
        type: String,
        trim: true
    },
    timezone: {
        type: String,
        trim: true
    },
    token: {
        type: String,
        trim: true
    },
    test: {
        type: Boolean,
        default: false
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Lead', LeadSchema);