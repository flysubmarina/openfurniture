module.exports = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.send({ err: 'Not logged in' })
}
