let bcrypt = require('bcrypt');
let User = require('../model/user');
let {createAccessToken, createRefreshToken, removeRefreshToken, refreshToken} = require('../middleware');

function login(req, res){
    User.findOne({ username: req.body.username }, (err, user) =>{
        if(err){
            res.status(403).json({message: 'Identifiant ou mot de passe incorrect'});
        }
        if(!user){
            res.status(403).json({message: 'Identifiant ou mot de passe incorrect'});
        }
        else if(user != null){
            bcrypt.compare(req.body.password, user.password)
            .then((result) => {
                if(result){
                    const accessToken = createAccessToken(user);
                    const refreshToken = createRefreshToken(user);
                    res.status(200).json({ user: { _id: user._id, id: user.id, username: user.username, role: user.role }, accessToken:accessToken, refreshToken: refreshToken, message: `${user.username} logged in!`});
                }
                else{
                    res.status(403).json({message: 'Identifiant ou mot de passe incorrect'});
                }
            });
        }
    })
}

function logout(req, res){
    if(req.body.token == null) return res.sendStatus(400);
    removeRefreshToken(req.body.token);
    res.status(204).send({message: 'Déconnecté'});
}

function updateAccessToken(req, res){
    const token = req.body.refreshToken;
    const username = req.body.username;
    if(refreshToken == null) return res.sendStatus(401);
    const newAccessToken = refreshToken(token, username);
    if(newAccessToken === false)return res.sendStatus(403);
    res.status(200).json({accessToken: newAccessToken});
}


module.exports = { login, logout, updateAccessToken };