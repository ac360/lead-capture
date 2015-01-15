// Dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment'),
    crypto = require('crypto');

// Campaign Schema
var CampaignSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    autoresponse_template: {
        type: Schema.Types.Mixed,
        default: {}
    },
    sequence: {
        type: Array,
        default: []
    },
    rule_one: {
        type: Schema.Types.Mixed,
        default: {}
    },
    rule_two: {
        type: Schema.Types.Mixed,
        default: {}
    },
    rule_three: {
        type: Schema.Types.Mixed,
        default: {}
    },
    rule_four: {
        type: Schema.Types.Mixed,
        default: {}
    },
    rule_five: {
        type: Schema.Types.Mixed,
        default: {}
    },
    rule_six: {
        type: Schema.Types.Mixed,
        default: {}
    },
    rule_seven: {
        type: Schema.Types.Mixed,
        default: {}
    },
    tags_included: {
        type: Array,
        default: []
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

CampaignSchema.set('autoIndex', false);

mongoose.model('Campaign', CampaignSchema);


// end