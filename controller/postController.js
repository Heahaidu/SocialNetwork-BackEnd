const { postModel, repostModel } = require('../models/post.js')
const { commentModel } = require('../models/comment.js')
const ErrorHandler = require('../utils/ErrorHandler.js')
const { json } = require('body-parser')
const catchAsyncError = require('../middlewares/catchAsyncError.js')
const APIFeature = require('../utils/apiFeature.js')
const follow = require('../models/follow.js')
const userModel = require('../models/user.js')
const jwt = require('jsonwebtoken')
const likeModel = require('../models/like.js')

exports.uploadPost = catchAsyncError(async(req, res, next) => {

    const content = req.body.content

    console.log(req.body)

    const post = (await postModel.create({user_id: req.user_id, content})).toObject()

    const user = await userModel.findById(post.user_id)

    if (!user) {
        
        return res.status(404).json({
            success: false,
            message: "User not found."
        })
    }

    const user_id = req.user_id

    post.name = user.name
    post.username = user.username
    post.avatar = user.avatar
    post.following = true
    post.is_like = await likeModel.findById(`${user_id}_${post._id}`) ? true: false
    post.like_count = await likeModel.countDocuments({ "post_id":post._id })
    post.comment_count = await commentModel.countDocuments({ "post_id":post._id })
    post.is_reposted = await repostModel.findById(`${user_id}_${post._id}`) ? true: false
    post.repost_count = await repostModel.countDocuments({ "post_id":post._id })

    res.status(200).json(
        post
    )

})

exports.getPosts = catchAsyncError(async(req, res, next) => {
    const apiFeature = new APIFeature(postModel, req.query, req.query.skip).search()

    var posts = (await apiFeature.query)

    if (req.cookies['access-token'])
        var user_id = jwt.verify(req.cookies['access-token'], process.env.SECRET_KEY).id
    else 
        var user_id = ''
    
    for (let i in posts) {
        const user = await userModel.findById(posts[i].user_id)
        posts[i].name = user.name
        posts[i].username = user.username
        posts[i].avatar = user.avatar
        posts[i].following = user_id == posts[i].user_id || await follow.findById(`${user_id}_${posts[i].user_id}`) ? true: false
        posts[i].is_like = await likeModel.findById(`${user_id}_${posts[i]._id}`) ? true: false
        posts[i].like_count = await likeModel.countDocuments({ "post_id":posts[i]._id })
        posts[i].comment_count = await commentModel.countDocuments({ "post_id":posts[i]._id })
        posts[i].is_reposted = await repostModel.findById(`${user_id}_${posts[i]._id}`) ? true: false
        posts[i].repost_count = await repostModel.countDocuments({ "post_id":posts[i]._id })
    }

    res.status(200).json(
        posts
    )
})

exports.getProfilePosts = catchAsyncError(async(req, res, next) => {
    if (req.query.profile == "posts") {
        var posts = await postModel.find({user_id: req.body.user_id}).skip(req.query.skip).limit(6).lean()
    } else if (req.query.profile == "likes") {
        var likes = await likeModel.find({user_id: req.body.user_id, post_id: { $exists: true}}).skip(req.query.skip).limit(6)
        
        var posts = []
        for (let i in likes) {
            const post = await postModel.findById(likes[i].post_id).lean()
            if (post) posts.push(post)
        }
    } else if (req.query.profile == "reposts") {
        var reposts = await repostModel.find({user_id: req.body.user_id}).skip(req.query.skip).limit(6)

        var posts = []
        for (let i in reposts) {
            const post = await postModel.findById(reposts[i].post_id).lean()
            if (post) posts.push(post)
        }
    }
    if (req.cookies['access-token'])
        var user_id = jwt.verify(req.cookies['access-token'], process.env.SECRET_KEY).id
    else 
        var user_id = ''
    
    for (let i in posts) {
        const user = await userModel.findById(posts[i].user_id)
        posts[i].name = user.name
        posts[i].username = user.username
        posts[i].avatar = user.avatar
        posts[i].following = user_id == posts[i].user_id || await follow.findById(`${user_id}_${posts[i].user_id}`) ? true: false
        posts[i].is_like = await likeModel.findById(`${user_id}_${posts[i]._id}`) ? true: false
        posts[i].like_count = await likeModel.countDocuments({ "post_id":posts[i]._id })
        posts[i].comment_count = await commentModel.countDocuments({ "post_id":posts[i]._id })
        posts[i].is_reposted = await repostModel.findById(`${user_id}_${posts[i]._id}`) ? true: false
        posts[i].repost_count = await repostModel.countDocuments({ "post_id":posts[i]._id })
    }

    res.status(200).json(
        posts
    )
})

exports.getPost = catchAsyncError(async(req, res, next) => { 

    var post = await postModel.findById(req.params.id)

    if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found."
        })
    }

    post = post.toObject()
    
    const user = await userModel.findById(post.user_id)

    if (!user) {
        
        return res.status(404).json({
            success: false,
            message: "User not found."
        })
    }

    const user_id = jwt.verify(req.cookies['access-token'], process.env.SECRET_KEY).id

    post.name = user.name
    post.username = user.username
    post.avatar = user.avatar
    post.following = user_id == post.user_id || await follow.findById(`${user_id}_${post.user_id}`) ? true: false
    post.is_like = await likeModel.findById(`${user_id}_${post._id}`) ? true: false
    post.like_count = await likeModel.countDocuments({ "post_id":post._id })
    post.comment_count = await commentModel.countDocuments({ "post_id":post._id })
    post.is_reposted = await repostModel.findById(`${user_id}_${post._id}`) ? true: false
    post.repost_count = await repostModel.countDocuments({ "post_id":post._id })

    res.status(200).json(
        post
    )
})

exports.deletePost = catchAsyncError(async(req, res, next) => { 
    const post = await postModel.findById(req.params.id)

    if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found."
        })
    }

    if (post.user_id.toString() == req.user_id) {
        await postModel.findByIdAndDelete(req.params.id)
    } else {
        return res.status(404).json({
            success: false
        })
    }
 

    await commentModel.deleteMany({ "post_id": req.params.id })

    await likeModel.deleteMany({ "post_id": req.params.id })

    res.status(200).json({
        success: true
    })
})

exports.repost = catchAsyncError(async(req, res, next) => {
    const post = await postModel.findById(req.params.id)

    // Post not found & Allready repost & Your post
    if (!post || (await repostModel.findById(`${req.user_id}_${req.params.id}`))) {
        return res.status(404).json({
            success: false
        })
    }
    
    await repostModel.create({_id: `${req.user_id}_${req.params.id}`, user_id: req.user_id, post_id: req.params.id})

    const count = await repostModel.countDocuments({ "post_id":req.params.id })

    res.status(201).json(count)
})

exports.unrepost = catchAsyncError(async(req, res, next) => {
    const post = await postModel.findById(req.params.id)

    // Post not found & Allready repost & Your post
    if (!post || !(await repostModel.findByIdAndDelete(`${req.user_id}_${req.params.id}`))) {
        return res.status(404).json({
            success: false
        })
    }

    const count = await repostModel.countDocuments({ "post_id":req.params.id })

    res.status(201).json(count)
})