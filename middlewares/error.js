function errorHandler(error, req, res, next) {
    res.status(500).json({"Error": error})
    
    next()
}


module.exports = {errorHandler}