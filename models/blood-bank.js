const { Schema, model } = require('mongoose');

module.exports = model('blood-bank', 
    new Schema({
        email: {type: String, required: true},
        name: { type: String, required: true },
        image: { data: Buffer, contentType: String },
        address: { type: String, require: true },
        contact: { type: String, require: true },
        contact_email: { type: String, require: true },
        link: { type: String, require: true },

        a_plus: { type: Number, require: true },
        b_plus: { type: Number, require: true },
        ab_plus: { type: Number, require: true },
        o_plus: { type: Number, require: true },

        a_minus: { type: Number, require: true },
        b_minus: { type: Number, require: true },
        ab_minus: { type: Number, require: true },
        o_minus: { type: Number, require: true }
    })
);