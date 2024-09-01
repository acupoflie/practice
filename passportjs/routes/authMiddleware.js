module.exports.isAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({
            message: 'you are not authorized to view this resource'
        })
    }
}

module.exports.isAdmin = (req, res, next) => {
    if(req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        res.status(401).json({
            message: 'you are not authorized to view this ADMIN resource'
        })
    }
}