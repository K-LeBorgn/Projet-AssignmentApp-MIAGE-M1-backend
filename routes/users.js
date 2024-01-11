let bcrypt = require('bcrypt');
let User = require('../model/user');
let {createAccessToken, createRefreshToken, removeRefreshToken, refreshToken} = require('../middleware');

function login(req, res){
    console.log("POST login reçu :", {username: req.body.username, password: req.body.password});

    User.findOne({ username: req.body.username }, (err, user) =>{
        if(err){res.send(err)}

        bcrypt.compare(req.body.password, user.password)
        .then((result) => {
            if(result){
                const accessToken = createAccessToken(user);
                const refreshToken = createRefreshToken(user);
                res.status(200).json({ user: { id: user.id, username: user.username, role: user.role }, accessToken:accessToken, refreshToken: refreshToken, message: `${user.username} logged in!`});
            }
            else{
                res.status(403).json({message: 'Mot de passe incorrect'});
            }
        });
        
    })
}

function register(req, res){
    let user = new User();
    user.id = req.body.id;
    user.username = req.body.username;
    user.password = req.body.password;
    console.log("POST register reçu :", {username: req.body.username, password: req.body.password});
    User.findOne({ username: req.body.username }, (err, foundUser) =>{
        if(err){res.send(err)}
        if(foundUser){
            res.status(403).json({message: 'Username already exists'});
        }
        else{
            bcrypt.hash(req.body.password, 10)
            .then((hashedPassword) => {

                user.password = hashedPassword;

                user.save( (err) => {
                    if(err){
                        res.status(400).send(err);
                    }

                    res.status(200).json({ message: `${user.username} saved!`})
                })
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


module.exports = { login, register, logout, updateAccessToken };