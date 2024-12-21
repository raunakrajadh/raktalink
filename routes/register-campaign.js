const express = require('express');
const app = express.Router();
const raktalink = require('../functions')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', async (req, res) => {

    if(!req.cookies.loggedIn) return res.redirect('/login?nextpage=register-campaign')
    res.render('register-campaign', {req})
})

app.post('/', upload.single('pic'), async (req, res) => {

    if(!req.cookies.loggedIn) return res.redirect('/login?nextpage=register-campaign')

    const { name, date, time, venue, link, description } = req.body;
    const image = req.file;
    
    const newCampaign = new raktalink.campaignModel({
        name,
        image: {
            data: image.buffer,
            contentType: image.mimetype,
        },
        date,
        time,
        venue,
        link,
        description
    });

    await newCampaign.save();
    res.redirect('/')
})

module.exports = {app};