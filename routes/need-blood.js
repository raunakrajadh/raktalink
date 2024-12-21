const express = require('express');
const app = express.Router();
const raktalink = require('../functions')

app.get('/', (req, res) => {
    res.render('need-blood', {req, locations: raktalink.locations})
})

app.post('/', async (req, res) => {

    let bloodgroup = req.body.bloodgroup;
    let amount = req.body.amount;
    let address = req.body.address;

    let bloodField = raktalink.bloodName[bloodgroup]

    let bloodbanks = await raktalink.bloodbankModel.find({
        address: address,
        [bloodField]: { $gte: Number(amount) / 1000 }
    }).sort({ [bloodField]: -1 });

    res.render('need-blood-search', {req, bloodgroup, amount, address, bloodbanks, bloodName: raktalink.bloodName})
})

module.exports = {app};