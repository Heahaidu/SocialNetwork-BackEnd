const { ObjectId } = require('mongodb')
const mongoDB = require('mongoose')

exports.postModel = mongoDB.model('posts', new mongoDB.Schema({
    user_id: {
        type: ObjectId,
        required: true,
    },
    content: {
        type: String,
        required: [true, 'Enter content.'],
        trim: true
    },
    create_time: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false }))

exports.repostModel = mongoDB.model('reposts', new mongoDB.Schema({
    _id: { 
        type: String, 
        required: true 
    },
    user_id: {
        type: ObjectId,
        require: true
    },
    post_id: {
        type: ObjectId,
        require: false
    },
    create_time: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false }))

