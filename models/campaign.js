const { Schema, model } = require('mongoose');

module.exports = model('campaign', 
    new Schema({
        name: { type: String, required: true },
        image: { data: Buffer, contentType: String },
        date: { type: String, require: true },
        time: { type: String, require: true },
        venue: { type: String, require: true },
        link: { type: String, require: true },
        description: { type: String, require: true },
    })
);