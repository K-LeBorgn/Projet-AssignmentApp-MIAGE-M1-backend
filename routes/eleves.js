let Eleves = require('../model/eleve');

// Récupérer tous les eleves (GET)
function getEleves(req, res) {
    Eleves.find((err, eleves) => {
        if (err) {
            res.send(err)
        }
        res.send(eleves);
    });
}

function postEleve(req, res) {
    let eleve = new Eleves();
    console.log("body " , req.body);
    eleve.id = req.body.id;
    eleve.nom = req.body.nom;
    eleve.prenom = req.body.prenom;

    console.log("POST eleve reçu :");
    console.log(eleve)

    eleve.save((err) => {
        if (err) {
            res.send('cant post eleve ', err);
        }
        res.json({ message: `${eleve.nom} saved!` })
    })
}

module.exports = { getEleves, postEleve };