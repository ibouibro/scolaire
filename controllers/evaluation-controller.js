const sql = require("./../Database/db.js");
const router = global.router;

const userMiddleware = (req, res, next) =>{
    if(req.session.connected == null )
    {

     res.redirect("/homepage");
        
    }else{

    next();
    }
}

const enseignantMiddleware = (req, res, next) =>{
    if(req.session.connected == null || req.session.role == "élève"  || req.session.role == "parent")
    {

     res.redirect("/homepage");
        
    }else{

    next();
    }
}

router.get("/evaluations", userMiddleware, function(request, response){

    sql.query("select * from classe_enseignant where id_user = '"+request.session.num+"' ",function(err,res){
        if(err) throw err;
        else{
console.log(res)
            for(var i=0;i< res.length;i++)
            {
                let id_matiere = res[i].id_matiere;
                let id_classe = res[i].id_classe;
                sql.query("select * from evaluation where type= 'composition' and semestre = 'premier' and id_classe = '"+id_classe+"' and id_matiere = '"+id_matiere+"' and annee = '"+request.session.annee+"'  ",function(err, enr){
                    if(err) throw err;
                    else{
                        if( enr.length == 0)
                        {
                            sql.query("insert into evaluation (type,id_matiere,id_classe,semestre,annee) values ('composition','"+id_matiere+"','"+id_classe+"','premier','"+request.session.annee+"') ",function(err,r){
                                if(err) throw err;
                            else{
                                sql.query("select id from user u, classe_eleve c where c.id_eleve = u.id and c.id_classe = '"+id_classe+"' and c.annee = '"+request.session.annee+"' ",function(err,el){
                                    if(err) throw err;
                                    else{
                                        console.log(el)
                                        for(var j=0;j<el.length;j++){
                                            sql.query("insert into note (valeur,id_evaluation,id_eleve) values ('','"+r.insertId+"','"+el[j].id+"')")
                                        }
                                        

                                        sql.query("select *  from evaluation where type= 'composition' and semestre = 'second' and id_classe = '"+id_classe+"' and id_matiere = '"+id_matiere+"' and annee = '"+request.session.annee+"'  ",function(err, enr1){
                                            if(err) throw err;
                                            else{
                                                if(enr1.length ==0)
                                                {
                                                    sql.query("insert into evaluation (type,id_matiere,id_classe,semestre,annee) values ('composition','"+id_matiere+"','"+id_classe+"','second','"+request.session.annee+"') ",function(err,r1){
                                                        if(err) throw err;
                                                    else{
                                                        sql.query("select id from user u, classe_eleve c where c.id_eleve = u.id and c.id_classe = '"+id_classe+"' and c.annee = '"+request.session.annee+"' ",function(err,el1){
                                                            if(err) throw err;
                                                            else{
                                                                for(var j=0;j<el1.length;j++){
                                                                    sql.query("insert into note (valeur,id_evaluation,id_eleve) values ('','"+r1.insertId+"','"+el1[j].id+"')")
                                                                }
                                                            }
                                                        })
                                                    }
                                                    });
                                                }
                                                    
                                            }
                                        })
                                    }
                                })
                                
                            }
                            });
                        }
                            
                    }
                })

                
            }
        }
    })

    sql.query("select e.*, c.nom as classe, c.niveau, m.nom as matiere, u.id as id_user from user u, classe_enseignant ce, evaluation e, classe c, matiere m where u.id = ce.id_user and c.id = ce.id_classe and e.id_classe = c.id and e.id_matiere = m.id and e.annee = '"+request.session.annee+"'", function(err,evaluations){
        if(err) throw err;
        else{
            sql.query("select distinct(ce.id_classe), c.nom, c.niveau from classe_enseignant ce, classe c, user u where ce.id_classe = c.id and u.id = ce.id_user and ce.id_user = '"+request.session.num+"' and ce.annee = '"+request.session.annee+"'",function(err,classes){
                if(err) throw err;
                else{

                    sql.query("select distinct(ce.id_matiere), ce.id_classe, m.nom from classe_enseignant ce, matiere m, user u where ce.id_matiere = m.id and u.id = ce.id_user and ce.id_user = '"+request.session.num+"' and ce.annee = '"+request.session.annee+"'",function(err,matieres){
                        if(err) throw err;
                        else{
                            sql.query("select u.id, u.parent, u.role, ce.id_classe from user u, classe_eleve ce where u.role = 'élève' and ce.id_eleve = u.id ",function(err,eleves){
                                if(err) throw err;
                                else{
                                    sql.query("select id, parent from user where role = 'élève'",function(err,parents){
                                        if(err) throw err;
                                        else{
                                            var message = request.session.message;
                                    request.session.message = null;
                                    response.render("evaluations/evaluations",{
                                        message,
                                        evaluations,
                                        matieres,
                                        classes,
                                        role : request.session.role,
                                        eleves,
                                        parents
                                    })
                                        }
                                    })
                                    var message = request.session.message;
                                    request.session.message = null;
                                    response.render("evaluations/evaluations",{
                                        message,
                                        evaluations,
                                        matieres,
                                        classes,
                                        role : request.session.role,
                                        eleves
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

router.post("/creer_devoir" ,enseignantMiddleware, function(request,response){
sql.query("insert into evaluation (type,date,semestre,annee,id_matiere,id_classe) values('devoir','"+request.body.date+"','"+request.body.semestre+"','"+request.session.annee+"','"+request.body.matiere+"','"+request.body.classe+"')",function(err,res){
    if(err) throw err;
    else
    {
        sql.query("select id from user u, classe_eleve c where c.id_eleve = u.id and c.id_classe = '"+request.body.classe+"' and c.annee = '"+request.session.annee+"' ",function(err,el1){
            if(err) throw err;
            else{
                for(var j=0;j<el1.length;j++){
                    sql.query("insert into note (valeur,id_evaluation,id_eleve) values ('','"+res.insertId+"','"+el1[j].id+"')")
                }
                request.session.message = "le devoir a été créé";
                response.redirect("/evaluations");
           

            }
        })
         }
})
})

router.post("/modifier_evaluation",enseignantMiddleware,function(request,response){
    sql.query("update evaluation set date = '"+request.body.date+"', date_fin = '"+request.body.date_fin+"', id_classe = '"+request.body.classe+"', id_matiere = '"+request.body.matiere+"', semestre = '"+request.body.semestre+"' where id = '"+request.body.id+"'",function(err,res){
        if(err) throw err;
        else{
            request.session.message="l'évaluation a été modifiée";
            response.redirect("/evaluations");
        }
    })
})

router.post("/modifier_notes",enseignantMiddleware,function(request,response){
    for(var i=0; i< request.body.idd.length;i++)
    {
        sql.query("update note set valeur = '"+request.body.valeur[i]+"' where id_eleve = '"+request.body.idd[i]+"' and id_evaluation = '"+request.body.id_evaluation+"' ");
    }

    request.session.message = "les notes ont été modifiées";
    response.redirect("/evaluations");
})

router.get("/voir_evaluation",enseignantMiddleware,function(request,response){
    
    sql.query("select c.nom as classe, c.niveau,e.semestre,e.type, n.*, m.nom as matiere,u.nom,u.prenom from user u, classe_eleve ce, evaluation e, classe c, matiere m, note n where n.id_evaluation = e.id and e.id_classe = c.id and e.id_matiere = m.id and u.id = ce.id_eleve  and c.id = ce.id_classe = e.id_classe and n.id_eleve = u.id and e.id = '"+request.query.id+"' and e.id_matiere = '"+request.query.matiere+"' ",function(err,notes){
        if(err) throw err;
        else{
            console.log(notes)
            response.render("evaluations/notes",{
                notes,
                role : request.session.role
            })
        }
    })
})

module.exports = router;