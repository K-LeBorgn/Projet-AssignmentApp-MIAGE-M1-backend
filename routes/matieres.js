let Matiere = require('../model/matiere');

// Récupérer toutes les matières (GET)
function getMatieres(req, res) {
    Matiere.find((err, matiere) => {
        if (err) {
            res.send(err)
        }
        res.send(matiere);
    });
}

function postMatiere(req, res) {
    let matiere = new Matiere();
    console.log("body " , req.body);
    matiere.id = req.body.id;
    matiere.nom = req.body.nom;
    matiere.prof = req.body.prof;
    matiere.imageMatiere = req.body.imageMatiere;
    matiere.imageProf = req.body.imageProf;

    console.log("POST matiere reçu :");
    console.log(matiere)

    matiere.save((err) => {
        if (err) {
            res.send('cant post matiere ', err);
        }
        res.json({ message: `${matiere.nom} saved!` })
    })
}

module.exports = { getMatieres, postMatiere };