// Dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment'),
    crypto = require('crypto');

// Tag Schema
var TagSchema = new Schema({
    tag: {
        type: String,
        required: true,
        set: function(tag) {
            // Alphanumerics Only (Except Underscores)
            tag = tag.toString().trim().toLowerCase().replace(/[^\w\s-]/gi, '');
            // Replace Space & Underscores with Hyphens
            tag = tag.replace(/\s+/g, '-').replace(/_/g, '-');
            // Return
            return tag;
        }
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

TagSchema.set('autoIndex', false);

mongoose.model('Tag', TagSchema);


// end