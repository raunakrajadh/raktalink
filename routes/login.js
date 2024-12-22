const express = require('express');
const app = express.Router();
const raktalink = require('../functions')

app.get('/', async (req, res) => {
    let nextPage = 'home'
    if(req.query.nextpage) nextPage = req.query.nextpage;
    if(req.cookies.loggedIn) return res.redirect(`/${nextPage}`)
    res.render('login', {req, warning: "", nextPage})
})

app.post('/', async (req, res) => {

    let nextPage = 'home'
    if(req.query.nextpage) nextPage = req.query.nextpage;

    if(req.cookies.loggedIn) return res.redirect(`/${nextPage}`)

    const email = req.body.email;
    const password = req.body.password;
    let userData = await raktalink.loginModel.findOne({email: email})

    if(!userData) return res.render('login', {req, nextPage, warning: "You dont have an account registered with us please register!"})
    if(userData.password !== password) return res.render('login', {req, nextPage, warning: "You email or password do not match!"});

    res.cookie('loggedIn', email, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
    res.redirect(`/${nextPage}`);
})

module.exports = {app};
