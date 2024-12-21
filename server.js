const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const mongoose  = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const raktalink = require('./functions.js');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('assets'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}));
app.use('/assets', express.static('assets'));
app.use('/', require('./routes/_routes.js').app)

mongoose.connect(raktalink.config.mongoose_uri)
.then(() => {
    console.log('Mongodb Connected');   
})
.catch((err) => {
    console.error('Failed to connect mongodb', err);
})

let port = process.env.port || 5000
server.listen(port, () => {console.log('Listening at port: ' + port)})