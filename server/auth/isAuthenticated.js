module.exports = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.status(500).send({ err: 'Not logged in' })
}
