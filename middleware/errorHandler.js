module.exports = {
    errorHandlers: (err, req, res, next) => {
        if (err) {
            switch (err.name) {
                case "SignInError":
                    res.status(401).json({message: 'Invalid username or password'})
                    break
                case "Unauthorize":
                    res.status(401).json({message: 'Dont have access'})
                    break
                case "notFound":
                    res.status(404).json({message: 'Data not found'})
                    break
                default:
                    res.status(500).json({message: 'internal server error'})
                    break
            }
        }
    }
}