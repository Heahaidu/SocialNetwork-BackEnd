const sendToken = (user, statusCode, res) => {
    const token = user.getToken(user)

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 *60 *1000
        ),
        httpOnly: true
    }
    res.status(statusCode).cookie('access-token', token, options).json(user)
}

module.exports = sendToken