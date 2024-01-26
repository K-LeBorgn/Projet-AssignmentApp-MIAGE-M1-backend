let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)
function getAssignments(req, res) {
    let aggregateQuery = Assignment.aggregate();
    Assignment.aggregatePaginate(aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        },
        (err, assignments) => {
            if (err) {
                res.send(err);
            }
            Assignment.populate(assignments.docs, { path: 'matiere auteur', select: '-password' })
                .then((populatedDocs) => {
                    assignments.docs = populatedDocs;
                    console.log(assignments);
                    res.send(assignments);
                })
                .catch((err) => {
                    res.send(err);
                });
        }
    );
}


// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;

    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        Assignment.populate(assignment, { path: 'matiere auteur' , select: '-password'})
            .then((assignment) =>
                res.json(assignment)
            )
    })
}

function getAssignmentsByName(req, res){
    let assignmentName = req.query.name;

    let aggregateQuery = Assignment.aggregate();

    if (assignmentName) {
        aggregateQuery.match({nom: {$regex: assignmentName, $options: "i"}})
    }

    Assignment.aggregatePaginate(aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        },
        (err, assignments) => {
            if (err) {
                res.send(err);
            }
            Assignment.populate(assignments.docs, { path: 'matiere auteur', select: '-password' })
                .then((populatedDocs) => {
                    assignments.docs = populatedDocs;
                    console.log(assignments);
                    res.send(assignments);
                })
                .catch((err) => {
                    res.send(err);
                });
        }
    );
}

function getAssignmentsRendu(req, res){
    Assignment.aggregatePaginate(Assignment.aggregate().match({rendu: true}),
    {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
    },
    (err, assignments) => {
        if (err) {
            res.send(err);
        }
        Assignment.populate(assignments.docs, { path: 'matiere auteur', select: '-password' })
            .then((populatedDocs) => {
                assignments.docs = populatedDocs;
                console.log(assignments);
                res.send(assignments);
            })
            .catch((err) => {
                res.send(err);
            });
    });
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;
    assignment.matiere = req.body.matiere;
    assignment.auteur = req.body.auteur;
    assignment.note = req.body.note;
    assignment.remarques = req.body.remarques;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!`})
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'updated'})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}




module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment, getAssignmentsByName, getAssignmentsRendu };
