const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { readFileSync } = require('fs');

const mongoDB = require('./database/mongoDBConnect.js');

const jwt = require('jsonwebtoken')

const app = express();
app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true}))

require('dotenv').config() //({path: ''})


process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`)
    console.log('Shutdown server.')
    process.exit(1)
})

const PORT = 25565;

//Database connect
mongoDB();

app.get('/', async(req, res) => {
    res.send('It work!');
    console.log('It work!');
});

const Error = require('./middlewares/error')

const userAuth = require('./routes/userAuth');
app.use('/auth', userAuth);

const post = require('./routes/post');
app.use('/post', post);

const like = require('./routes/like')
app.use('/like', like)

const comment = require('./routes/comment')
app.use('/comment', comment)

const follow = require('./routes/follow')
app.use('/query', follow)

const profile = require('./routes/profile')
app.use('/', profile)

app.use(Error)

const server = app.listen(PORT, console.log(`Server is running on port: ${PORT}`));

process.on('unhandledRejection', err => {
    console.log('ERROR: ' + err)
    console.log('Shutdown server.')
    server.close(() => {
        process.exit(1)
    })
})
