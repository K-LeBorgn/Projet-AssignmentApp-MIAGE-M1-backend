let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let EleveSchema = Schema({
    id: Number,
    nom: String,
    prenom: String
});

module.exports = mongoose.model('Eleve', EleveSchema);