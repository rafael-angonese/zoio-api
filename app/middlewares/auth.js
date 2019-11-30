var jwt = require('jsonwebtoken');

async function verifyJWT(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send({ message: 'No token provided.' });
    }

    try {
        const decoded = await jwt.verify(token, process.env.SECRET)
        req.userId = decoded.id;
        return next();
    } catch (err) {
        return res.status(401).send({ message: 'Failed to authenticate token.' });
    }

}

module.exports = { verifyJWT: verifyJWT }