require('dotenv').config();
let jwt = require('jsonwebtoken');

let refreshTokens = [];

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        req.token = bearerHeader.split(' ')[1];
        next();
    }else{
        res.status(403).json({ message: 'Forbidden, need accessToken' });
    }
}

function createAccessToken(user){
    return jwt.sign({username: user.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20m'});
}

function createRefreshToken(user){
    const refreshToken = jwt.sign({username: user.username}, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    return refreshToken;
}

function removeRefreshToken(token){
    refreshTokens = refreshTokens.filter(t => t !== token);
}

function refreshToken(refreshToken, username){
    if(!refreshTokens.includes(refreshToken)) return false;
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        const accessToken = createAccessToken({username: username});
        return accessToken;
    })

}

module.exports = { verifyToken, createAccessToken, createRefreshToken, removeRefreshToken, refreshToken }