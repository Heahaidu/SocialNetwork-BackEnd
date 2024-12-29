const { ObjectId } = require('mongodb')
const mongoDB = require('mongoose')

const likeSchema = new mongoDB.Schema({
    _id: { 
        type: String, 
        required: true 
    },
    user_id: {
        type: ObjectId,
        require: true
    },
    following_id: {
        type: ObjectId,
        require: false
    },
    create_time: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false })

module.exports = mongoDB.model('follows', likeSchema)