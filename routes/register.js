const express = require('express');
const app = express.Router();
const raktalink = require('../functions')
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: raktalink.config.gmail.user,
        pass: raktalink.config.gmail.pass
    }
});

app.get('/', async (req, res) => {
    if(req.cookies.loggedIn) return res.redirect('/')
    res.render('register', {req, warning: ""})
})

app.post('/', async (req, res) => {

    if(req.cookies.loggedIn) return res.redirect('/')

    const email = req.body.email;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;

    let userData = await raktalink.loginModel.findOne({email: email})
    if(userData) return res.render('register', {req, warning: "You already have an account please login!"})
        
    if(password !== confirm_password){
        return res.render('register', {req, warning: "Please confirm your password correctly!"})
    }

    let randomCode = Math.floor(Math.random() * 999999) + 111111;
    res.cookie('verification_code', randomCode, { maxAge: 60 * 60 * 1000, httpOnly: true })
    res.cookie('unverified_email', email, { maxAge: 60 * 60 * 1000, httpOnly: true })
    res.cookie('unverified_password', password, { maxAge: 60 * 60 * 1000, httpOnly: true })

    transporter.sendMail(
        {
            from: 'no-reply@raktalink.raunakrajadhikari.com.np',
            to: email,
            subject: 'Email Verification',
            html:
            `
<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <!-- LOGO -->
    <tr>
        <td bgcolor="Purple" align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor="Purple" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                        <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 0;">Thanks for registering with us. Please use the code below to complete your registration. This code is valid only for 1 hour.</p>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" align="left">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                    <table border="0" cellspacing="0" cellpadding="0">
                                    <h2>Your Code:</h2>
                                        <tr>
                                            <td align="center" style="border-radius: 3px;" bgcolor="Purple">
                                                <a style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">
                                                    ${randomCode}
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <br><br><br><br><br><br><br><br><br><br>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
            `
        }, async (error, data) => {
        if(error){
            res.render('register', {req, warning: "Could not send verification email please try again!"})
        }
        else{
            res.render('verify_register', {req, warning: "We have sent you a verification code in your email please check!", verified: false});
        }
    })

})

app.post('/verify', async (req, res) => {

    if(req.cookies.loggedIn) return res.redirect('/')

    if(!req.cookies.verification_code || !req.cookies.unverified_email || !req.cookies.unverified_password){
        return res.render('verify_register', {req, warning: "Your code is expired. Try sending a code again!"})
    }

    if(req.body.code == req.cookies.verification_code){
        let user = new raktalink.loginModel()
        user.email = req.cookies.unverified_email;
        user.password = req.cookies.unverified_password;
        await user.save()
        
        res.render('verify_register', {req, warning: "You successfully registered your account please <a href='/login'>login</a>", verified: true})
    }
    else{
        res.render('verify_register', {req, warning: "The verification code you entered is incorrect.", verified: false})
    }

})

module.exports = {app};