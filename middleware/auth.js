const authorizing = (userType) => {
    return (req, res, next) => {
        if (req.user.userType === userType) {
            next();
        }
        else {
            return res.json({ msg: 'fail' })
        }
    }
}
module.exports = {
    authorizing
}