const follow = require('../models/follow.js')
const user = require('../models/user.js')
const catchAsyncError = require('../middlewares/catchAsyncError.js')

exports.follow = catchAsyncError(async(req, res, next) => {
    // User not found & Allready follow
    if (req.user_id === req.params.id || !await user.findById(req.params.id)) {
        return res.status(404).json({
            success: false
        })
    }

    // Create follow
    if (! await follow.findById(`${req.user_id}_${req.params.id}`))
        await follow.create({_id: `${req.user_id}_${req.params.id}`, user_id: req.user_id, following_id: req.params.id})

    const following_count = await follow.countDocuments({ "user_id": req.user_id })

    res.status(200).json(following_count)
})

exports.unfollow = catchAsyncError(async(req, res, next) => {
    console.log('un')
    // User not found
    if (req.user_id === req.params.id || !await user.findById(req.params.id)) {
        return res.status(404).json({
            success: false
        })
    }

    await follow.findByIdAndDelete(`${req.user_id}_${req.params.id}`)

    const following_count = await follow.countDocuments({ "user_id": req.user_id })
    res.status(200).json(following_count)
})

exports.follower = catchAsyncError(async(req, res, next) => {

    const data = await follow.find({ "following_id": req.params.id })

    console.log(data)

    res.status(201).json({
        success: true,
        data
    })
})

exports.following = catchAsyncError(async(req, res, next) => {

    const data = await follow.find({ "user_id": req.params.id })

    res.status(201).json({
        success: true,
        data
    })
})

