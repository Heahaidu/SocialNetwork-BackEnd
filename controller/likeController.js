const likeModel = require('../models/like.js')
const { postModel } = require('../models/post.js')
const catchAsyncError = require('../middlewares/catchAsyncError.js')

exports.likePost = catchAsyncError(async(req, res, next) => {
    console.log('like')
    // Post not found & Allready like
    if (!(await postModel.findById(req.params.id)) || (await likeModel.findById(`${req.user_id}_${req.params.id}`))) {
        return res.status(404).json({
            success: false
        })
    }

    await likeModel.create({_id: `${req.user_id}_${req.params.id}`, user_id: req.user_id, post_id: req.params.id})

    var count = await likeModel.countDocuments({ "post_id":req.params.id })

    res.status(201).json(count)
})

exports.unlikePost = catchAsyncError(async(req, res, next) => {
    console.log('unlike')
    
    // Post not found
    if (!(await postModel.findById(req.params.id)) || !(await likeModel.findByIdAndDelete(`${req.user_id}_${req.params.id}`))) {
        return res.status(404).json({
            success: false
        })
    }

    var count = await likeModel.countDocuments({ "post_id":req.params.id })

    res.status(201).json(count)
})