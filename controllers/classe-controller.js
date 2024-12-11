const sql = require("./../Database/db.js");
const router = global.router;

function adminMiddleware(req, res, next){
    if (typeof req !== 'undefined' && typeof res !== 'undefined' && typeof next !== 'undefined') {
    if(req.session.connected == null || req.session.role != "administrateur")
    {

     res.redirect("/homepage");
        
    }else{

    next();
    }
}else{
    
}
}

router.post("/ajouter_classe", adminMiddleware, function(request,response){
    sql.query("insert into classe (nom,niveau,mensualite,inscription) values('"+request.body.nom+"','"+request.body.niveau+"','"+request.body.mensualite+"','"+request.body.inscription+"')",function(err,res){
        if(err) throw err;
        else
        {
            request.session.message = "la classe a été créée avec succès";
            response.redirect("/classes");
        }
    });
})

router.get("/classes", adminMiddleware, function(request,response){
    sql.query("select * from classe",function(err,res){
        var message = request.session.message;
        request.session.message = null;

        response.render("classes",{
            classes : res,
            message : message,
            role : request.session.role
        })
    })
})

router.post("/modifier_classe", adminMiddleware ,function(request,response){

    sql.query("select * from classe where nom = '"+request.body.nom+"' and niveau = '"+request.body.niveau+"' and id != '"+request.body.id+"' ",function(err1,res1){
        if(res1.length > 0)
        {
            request.session.message="impossible de modifier, cette classe existe déjà";
            response.redirect("/classes");
             
        }else{
            sql.query("update classe set nom = '"+request.body.nom+"', niveau = '"+request.body.niveau+"', mensualite = '"+request.body.mensualite+"', inscription = '"+request.body.inscription+"' where id = '"+request.body.id+"'",function(err,res){
                if(err) throw err
                 else
                {
        request.session.message="la classe a été mise à jour";
        response.redirect("/classes");
                }
            })
        }
    })
    
})

router.get("/supprimer_classe",adminMiddleware,function(request,response){
    sql.query("delete from classe where id = '"+request.query.id+"'",function(err,res){
        if(err) throw err
        else{
            request.session.message = "la classe a été supprimée avec succès";
            response.redirect("/classes");
        }
    })
})

router.get("/assignations",adminMiddleware,function(request,response){
    sql.query("select ce.annee,ce.id , u.nom, u.prenom, u.id as id_user, m.nom as matiere,m.niveau, m.id as id_matiere, c.nom as classe, c.id as id_classe from user u join classe_enseignant ce on u.id = ce.id_user join matiere_user mu on u.id = mu.id_user join classe c on c.id = ce.id_classe join matiere m on m.id = mu.id_matiere where ce.id_matiere = m.id ",function(err,assignations){
        if(err) throw err;
        else{
            sql.query("select * from classe",function(err,classes){
                if(err) throw err;
                else{

                    sql.query("select u.*,mu.id_matiere from user u, matiere_user mu where u.role = 'enseignant' and u.id = mu.id_user ",function(err,enseignants){
                        if(err) throw err;
                        else{
                           
                            sql.query("select * from matiere",function(err,matieres){
                                if(err) throw err;
                                else{
                                    var message = request.session.message;
            request.session.message = null;
            const currentYear = new Date().getFullYear();
                            let k ={}

                          
            response.render("assignations",{
                assignations,
                matieres : matieres,
                enseignants : enseignants,
                classes : classes,
                message : message,
                currentYear,
                role : request.session.role
            })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

router.post("/assigner_classe",adminMiddleware,function(request,response){
   sql.query("insert into classe_enseignant (id_classe,id_user,annee,id_matiere) values('"+request.body.classe+"','"+request.body.enseignant+"','"+request.body.annee+"' ,'"+request.body.matiere+"')",function(err,res){
    if(err) throw err;
    else{
        request.session.message = "l'assignation de classe a été créée avec succès";
        response.redirect("/assignations");
    }
   })
})

router.post("/modifier_assignation_classe",adminMiddleware,function(request,response){
sql.query("update classe_enseignant set id_user = '"+request.body.enseignant+"', annee = '"+request.body.annee+"' where id_classe = '"+request.body.id+"' ",function(err,res){
   if(err) throw err;
   else{
    request.session.message = "l'assignation de classe a été modifiée avec succès";
    response.redirect("assignations")
   } 
})
})

router.get("/supprimer_assignation",adminMiddleware,function(request,response){
    sql.query("delete from classe_enseignant where id = '"+request.query.id+"'",function(err,res){
        if(err) throw err;
        else{
            request.session.message = "l'assignation de classe a été supprimée";
            response.redirect("/assignations");
        }
    })
})

module.exports = router;