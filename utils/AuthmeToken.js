const jwt = require("jsonwebtoken")
const catchAsyncError = require("../middlewares/catchAsyncError")
const ErrorHandler = require("./ErrorHandler")
const user = require('../models/user')

module.exports = catchAsyncError(async(req, res, next) => {

    const token = req.cookies['access-token']  
	
    if (!token) return next(new ErrorHandler('You must login to do this.', 401))

    const decode_token = jwt.verify(token, process.env.SECRET_KEY)
    req.user_id = decode_token.id
    next()
})