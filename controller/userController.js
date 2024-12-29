const userModel = require('../models/user')
const catchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../utils/ErrorHandler')

const sendToken = require('../utils/cookie')
const jwt = require('jsonwebtoken')

// const { cartCreate } = require('../cart/cartController')

exports.userRegister = catchAsyncError(async(req, res, next) => {
    const { username, password, name } = req.body
    
    const user = await userModel.create({
        username,
        password,
        name
    })

    // cartCreate(user)

    sendToken(user, 200, res)
})

exports.userLogin = catchAsyncError(async(req,res, next) => {
	
	console.log("Login")
	
    const { username , password } = req.body

    if (!username || !password) {
        return next(new ErrorHandler('Please enter username & password', 400))
    }

    const user = await userModel.findOne({ username }).select('+password -createDate -__v')
    
    
    if (!user) return next(new ErrorHandler('Username or password is incorrect'), 401)
        
    const accpetAuth = await user.comparePassword(password)
        
    if (!accpetAuth) return next(new ErrorHandler('Username or password is incorrect.', 401))
            
            // req.session.cookie.expires = false;
            // req.session.cookie.maxAge = progess.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 *1000
    user.password = undefined
    sendToken(user, 200, res)
})

exports.userLogout = catchAsyncError(async(req, res, next) => {

    const token = req.cookies['access-token']

    if (!token) 
        return next(new ErrorHandler('You must login to do this', 401)) 

    res.status(200).cookie('access-token', null, {
        expires: new Date(Date.now()),
        httpOnly:  true
    }).json({
        success: true,
        mess: 'Logged out'
    })
})

exports.userInfo = catchAsyncError(async(req, res, next) => {
    const cookie = req.cookies['access-token']
    const decode = jwt.verify(cookie, process.env.SECRET_KEY);
    console.log(decode)

    req.user = await user.findById(decode.id)

    res.status(200).json({
        success: true,
        name: req.user.name
    })
})

exports.userLoginByCookie = catchAsyncError(async(req, res, next) => {
    const cookie = req.cookies['access-token']
    const decode = jwt.verify(cookie, process.env.SECRET_KEY);
    
    const user = await userModel.findOne({ _id: decode.id }).select('-createDate -__v')
    
    sendToken(user, 200, res)
})


