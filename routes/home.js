const express = require('express');
const app = express.Router();
const raktalink = require('../functions')

app.get('/', async (req, res) => {
    
    let campaigns = await raktalink.campaignModel.find().sort({ _id: -1 });;
    res.render('home', {req, campaigns})
})

module.exports = {app};