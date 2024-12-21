const { Schema, model } = require('mongoose');

module.exports = model('login', 
    new Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, require: true },
    })
);
