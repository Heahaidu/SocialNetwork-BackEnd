const { commentModel } = require('../models/comment')
const { postModel } = require('../models/post')
const likeModel = require('../models/like')
const userModel = require('../models/user.js')
const follow = require('../models/follow.js')
const catchAsyncError = require('../middlewares/catchAsyncError')
const jwt = require('jsonwebtoken')

exports.likeComment = catchAsyncError(async(req, res, next) => {
    // Comment not found & Allready like
    if (!await commentModel.findById(req.params.id) || await likeModel.findById(`${req.user_id}_${req.params.id}`)) {
        return res.status(404).json({
            success: false
        })
    }

    await likeModel.create({_id: `${req.user_id}_${req.params.id}`, user_id: req.user_id, comment_id: req.params.id})
    
    var count = await likeModel.countDocuments({ "comment_id": req.params.id })

    res.status(201).json(count)
})

exports.unlikeComment = catchAsyncError(async(req, res, next) => {
    
    // Comment not found
    if (!await commentModel.findById(req.params.id) || !await likeModel.findByIdAndDelete(`${req.user_id}_${req.params.id}`)) {
        return res.status(404).json({
            success: false
        })
    }

    var count = await likeModel.countDocuments({ "comment_id": req.params.id })

    res.status(201).json(count)
})

exports.addComment = catchAsyncError(async(req, res, next) => {
    const { content, replied_to_comment_id } = req.body
    console.log(req.body)
    // Post not found
    if (!await postModel.findById(req.params.id)) {
        return res.status(404).json({
            success: false
        })
    }

    data = {user_id: req.user_id, content, post_id: req.params.id}


    if (replied_to_comment_id) {
        const comment = await commentModel.findById(replied_to_comment_id)

        if (!comment) {
            return res.status(404).json({
                success: false,
                err: "Comment not found."
            })
        }

        const user = await userModel.findById(comment.user_id).lean()
        if (!user) {
            return res.status(404).json({
                success: false,
                err: "User not found."
            })
        }

        data.replied_to_comment_id = replied_to_comment_id
        data.replied_to_username = user.username
        data.parent_comment_id = comment.parent_comment_id ? comment.parent_comment_id: replied_to_comment_id

    }

    const comment = (await commentModel.create(data)).toObject()

    const user = await userModel.findById(comment.user_id)

    comment.name = user.name
    comment.username = user.username
    comment.avatar = user.avatar
    comment.following = true
    comment.is_like = false
    comment.like_count = 0
    comment.comment_count = 0
    comment.is_reposted = false //await repostModel.findById(`${user_id}_${comments[i]._id}`) ? true: false
    comment.repost_count = 0 //await repostModel.countDocuments({ "post_id":comments[i]._id })

    res.status(200).json(comment)
})

exports.deleteComment = catchAsyncError(async(req, res, next) => {

    // Post not found or Comment not found
    if (req.params.id === req.params.comment_id ||!await postModel.findById(req.params.id) || !await commentModel.findByIdAndDelete(req.params.comment_id)) {
        return res.status(404).json({
            success: false
        })
    }

    await commentModel.deleteMany({ "parent_comment_id" : req.params.comment_id})

    // commentModel.removeAllListeners({ parent_comment_id: req.params.comment_id })

    res.status(201).json({
        success: true
    })
})

exports.loadComment = catchAsyncError(async(req, res, next) => {

    var comments = await commentModel.find({ 'post_id': req.params.id, 'parent_comment_id': null}).sort({ create_time:-1 }).lean()

    if (req.cookies['access-token'])
        var user_id = jwt.verify(req.cookies['access-token'], process.env.SECRET_KEY).id
    else 
        var user_id = ''

    for (let i in comments) {
        const user = await userModel.findById(comments[i].user_id)
        comments[i].name = user.name
        comments[i].username = user.username
        comments[i].avatar = user.avatar
        comments[i].following = user_id == comments[i].user_id || await follow.findById(`${user_id}_${comments[i].user_id}`) ? true: false
        comments[i].is_like = await likeModel.findById(`${user_id}_${comments[i]._id}`) ? true: false
        comments[i].like_count = await likeModel.countDocuments({ "comment_id":comments[i]._id })
        comments[i].comment_count = await commentModel.countDocuments({ "parent_comment_id": comments[i]._id })

        comments[i].is_reposted = false //await repostModel.findById(`${user_id}_${comments[i]._id}`) ? true: false
        comments[i].repost_count = 0 //await repostModel.countDocuments({ "post_id":comments[i]._id })
    }

    res.status(200).json(
        comments
    )
})

exports.loadChildComment = catchAsyncError(async(req, res, next) => {

    var comments = await commentModel.find({ 'post_id': req.params.id, 'parent_comment_id': req.params.parent_comment_id}).lean()

    if (req.cookies['access-token'])
        var user_id = jwt.verify(req.cookies['access-token'], process.env.SECRET_KEY).id
    else 
        var user_id = ''

    for (let i in comments) {
        const user = await userModel.findById(comments[i].user_id)
        comments[i].name = user.name
        comments[i].username = user.username
        comments[i].avatar = user.avatar
        comments[i].following = user_id == comments[i].user_id || await follow.findById(`${user_id}_${comments[i].user_id}`) ? true: false
        comments[i].is_like = await likeModel.findById(`${user_id}_${comments[i]._id}`) ? true: false
        comments[i].like_count = await likeModel.countDocuments({ "comment_id":comments[i]._id })
        comments[i].comment_count = await commentModel.countDocuments({ "parent_comment_id": comments[i]._id })
        comments[i].is_reposted = false //await repostModel.findById(`${user_id}_${comments[i]._id}`) ? true: false
        comments[i].repost_count = 0 //await repostModel.countDocuments({ "post_id":comments[i]._id })
    }

    res.status(200).json(
        comments
    )
})


