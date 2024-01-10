let mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let Schema = mongoose.Schema;

let AssignmentSchema = Schema({
    id: Number,
    dateDeRendu: Date,
    nom: String,
    rendu: Boolean,
    auteur:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Eleve', // Référence au modèle Eleve
    },
    matiere: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Matiere', // Référence au modèle Matiere
    },
    note: Number | undefined,
    remarques: String
});
AssignmentSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);
