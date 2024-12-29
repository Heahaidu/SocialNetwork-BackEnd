const mongoDB = require('mongoose');

const connectionDB = () => {
    mongoDB.connect('mongodb://127.0.0.1:27017/SocialNetwork')
        .then(db => {
            console.log(`MongoDB had been connected! at ${db.connection.host}`)
        }).catch(err => console.log(err))
}

module.exports = connectionDB;