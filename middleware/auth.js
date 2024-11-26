const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.status(401).send("You are not authenticated");
}
module.exports = isAuthenticated;