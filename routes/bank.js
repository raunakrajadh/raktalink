const express = require('express');
const app = express.Router();
const raktalink = require('../functions')

app.get('/', async (req, res) => {
    
    if(!req.cookies.loggedIn) return res.redirect('/login?nextpage=bank')
    let bank = await raktalink.bloodbankModel.findOne({ email: req.cookies.loggedIn })
    if(!bank) return res.render('custom-page', {message: 'You do not have a blood bank registered.', link: `register-blood-bank`})

    res.render('bank', {req, bank, locations: raktalink.locations})
})

app.post('/', async (req, res) => {

    if(!req.cookies.loggedIn) return res.redirect('/login?nextpage=bank')
    let bank = await raktalink.bloodbankModel.findOne({ email: req.cookies.loggedIn })
    if(!bank) return res.render('custom-page', {message: 'You do not have a blood bank registered.', link: `register-blood-bank`})

    const { name, address, contact, link } = req.body;
    
    const { a_plus, a_minus, b_plus, b_minus, ab_plus, ab_minus, o_plus, o_minus } = req.body;

    await raktalink.bloodbankModel.updateOne(
        {email: req.cookies.loggedIn},
        {$set: { 
            name,
            address,
            contact,
            link,
            a_plus, b_plus, ab_plus, o_plus,
            a_minus, b_minus, ab_minus, o_minus
         }},
    )

    res.redirect('/bank')
})


module.exports = {app};