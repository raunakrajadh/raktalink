const express = require('express');
const app = express.Router();
const raktalink = require('../functions')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', async (req, res) => {

    if(!req.cookies.loggedIn) return res.redirect('/login?nextpage=register-blood-bank')
    let data = await raktalink.bloodbankModel.findOne({ email: req.cookies.loggedIn })
    if(data) return res.render('custom-page', {message: 'You already have a blood bank registered.', link: `bank`})
    res.render('register-blood-bank', {req, locations: raktalink.locations})
})

app.post('/', upload.single('pic'), async (req, res) => {

    if(!req.cookies.loggedIn) return res.redirect('/login?nextpage=register-blood-bank')

    const { name, address, contact, link, contact_email } = req.body;
    const image = req.file;
    
    const { a_plus, a_minus, b_plus, b_minus, ab_plus, ab_minus, o_plus, o_minus } = req.body;

    const newBank = new raktalink.bloodbankModel({
        email: req.cookies.loggedIn,
        name,
        image: {
            data: image.buffer,
            contentType: image.mimetype,
        },
        address,
        contact,
        contact_email,
        link,
        a_plus, b_plus, ab_plus, o_plus,
        a_minus, b_minus, ab_minus, o_minus
    })

    await newBank.save();
    res.redirect('/bank')
})

module.exports = {app};