const userModel = require('../models/user')
const catchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../utils/ErrorHandler')
const followModel = require('../models/follow')

const sendToken = require('../utils/cookie')
const jwt = require('jsonwebtoken')
const { response } = require('express')

exports.getProfile = catchAsyncError(async(req,res, next) => {
	
    var user = await userModel.findById(req.params.id).select('-createDate -__v')

    
    
    if (!user) return next(new ErrorHandler('User not found'), 401)

    user = user.toObject()

    if (req.cookies['access-token'])
        var user_id = jwt.verify(req.cookies['access-token'], process.env.SECRET_KEY).id
    else 
        var user_id = ''

    user.followers = await followModel.countDocuments({ "following_id": req.params.id })
    user.following = await followModel.countDocuments({ "user_id": req.params.id })
    user.is_following = user_id == user._id ? 2: (await followModel.findById(`${user_id}_${user._id}`)) ? 1: 0
    res.status(200).json(user)
})

exports.updateProfile = catchAsyncError(async(req, res, next) => {

    const { name, username, avatar } = req.body

    if (!name || !username) {
        console.log('UNSUCCESSFULL')
        return res.status(200).json({
            status: 'UNSUCCESSFULL'
        })
    }

    let user = await userModel.findOne({ "username": username })

    // user have username existed
    if (user) {
        // is not user account
        if (user.id != req.user_id) {
            return res.status(200).json({
                status: 'USERNAME_IS_NOT_AVAILABLE'
            })
        }

        // is user account
        var userChange = {}
        // 
        if (user.name == name) {
            return res.status(200).json({
                status: 'NOTHING_CHANGE'
            })
        }

        userChange.name = name

        if (avatar) userChange.avatar = avatar

        // update
        user = (await userModel.findByIdAndUpdate(req.user_id, userChange, { new:true })).toObject()
        user.status = 'PROFILE_UPDATE'
        return res.status(200).json(user)
    }
    
    var userChange = {
        name: name,
        username: username
    }

    if (avatar) userChange.avatar = avatar

    user = (await userModel.findByIdAndUpdate(req.user_id, userChange, { new:true })).toObject()
    user.status = 'PROFILE_UPDATE'
    return res.status(200).json(user)
    
})

exports.getFollowers = catchAsyncError(async(req, res, next) => {
    id = req.params.id
    const follows = await followModel.find({ following_id: id }).skip(req.query.skip).limit(20)

    let followers = []

    if (req.cookies['access-token'])
        var user_id = jwt.verify(req.cookies['access-token'], process.env.SECRET_KEY).id
    else 
        var user_id = ''

    for (const i in follows) {
        let user = await userModel.findById(follows[i].user_id).lean()
        user.is_following = user_id == user._id ? 2: (await followModel.findById(`${user_id}_${user._id}`)) ? 1: 0
        followers.push(user)
    }

    return res.status(200).json(followers)
})

exports.getFollowing = catchAsyncError(async(req, res, next) => {
    id = req.params.id
    const follows = await followModel.find({ user_id: id }).skip(req.query.skip).limit(20)

    let following = []

    if (req.cookies['access-token'])
        var user_id = jwt.verify(req.cookies['access-token'], process.env.SECRET_KEY).id
    else 
        var user_id = ''

    for (const i in follows) {
        let user = await userModel.findById(follows[i].following_id).lean()
        user.is_following = user_id == user._id? 2: (await followModel.findById(`${user_id}_${user._id}`)) ? 1: 0
        following.push(user)
    }

    return res.status(200).json(following)
})