const { ObjectId } = require('mongodb')
const mongoDB = require('mongoose')

exports.commentModel = mongoDB.model('comments', new mongoDB.Schema({
    user_id: {
        type: ObjectId,
        require: true
    },
    post_id: {
        type: ObjectId,
        require: true
    },
    parent_comment_id: {
        type: ObjectId,
        require: false
    },
    replied_to_comment_id: {
        type: ObjectId,
        require: false
    },
    replied_to_username: {
        type: String,
        require: false
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