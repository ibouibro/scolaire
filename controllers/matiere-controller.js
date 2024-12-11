const sql = require("./../Database/db.js");
const router = global.router;

const adminMiddleware = (req, res, next) =>{
    if(req.session.connected == null || req.session.role != "administrateur")
    {

     res.redirect("/homepage");
        
    }else{

    next();
    }
}


router.get("/matieres",adminMiddleware,function(request,response){
    sql.query("select * from matiere",(err,res)=>{
        if(err) throw err;
        else
        {
            var message = request.session.message;
            request.session.message = null;
            response.render("matieres/matieres",{
                message : message,
                role : request.session.role,
                matieres : res
            })
        }
        

    })
})

router.post("/ajouter_matiere",adminMiddleware,function(request,response){
    sql.query("insert into matiere (nom) value ('"+request.body.nom+"')",function(err,res){
        if(err) throw err;
        else{
            request.session.message = "la matière a été créée avec succès";
            response.redirect("/matieres")
        }
    })
})

router.get("/supprimer_matiere",adminMiddleware,function(request,response){
    sql.query("delete from matiere where id ='"+request.query.id+"'",function(err,res){
        if(err) throw err;
        else{
            request.session.message = "la matière a été supprimée avec succès";
            response.redirect("/matieres")
        }
    })
})

router.post("/modifier_matiere",adminMiddleware,function(request,response){
    sql.query("update matiere set nom = '"+request.body.nom+"'  where id ='"+request.query.id+"'",function(err,res){
        if(err) throw err;
        else{
            request.session.message = "la matière a été modifiée avec succès";
            response.redirect("/matieres")
        }
    })
})

router.get("/emploi",adminMiddleware, function(request,response){
    sql.query("select * from classe where id in (select id_classe from emploi)",function(err,classes_m){
        if(err) throw err;
        else{
sql.query("select * from classe where id not in (select id_classe from emploi)",function(err,classes_c){
    if(err) throw err;
    else{
        var message = request.session.message;
        request.session.message=null;
                    response.render("emploi_du_temps/classes",{
                        classes_m,
                        classes_c,
                        message,
                        role : request.session.role
                    })
    }
})

        }
    })
})


router.get("/creer_emploi_form",adminMiddleware, function(request,response){

    sql.query("select id, nom, niveau from classe where id = '"+request.query.id+"'",function(err,res){
        if(err) throw err;
        else{
            sql.query("select * from matiere",function(err,matieres){
                if(err) throw err;
                else{
                    console.log("annee "+request.session.annee)
                    response.render("emploi_du_temps/creer_emploi_form",{
                        classe : res[0],
                        role : request.session.role,
                        matieres,
                        annee : request.session.annee
                    })
                }
            })
            
        }
    })
   
})


router.get("/voir_emploi", adminMiddleware, function(request,response){
    sql.query("select c.heure, c.matiere, cl.nom, cl.id as id_classe, cl.niveau, e.id from cours c, classe cl, emploi e where e.id_classe = cl.id and c.id_emploi = e.id and e.id_classe = '"+request.query.id+"' and e.annee = '"+request.session.annee+"' ",function(err,cours){
        if(err) throw err;
        else{
            sql.query("select * from matiere",function(err,matieres){
                if(err) throw err;
                else{
                    response.render("emploi_du_temps/emploi_du_temps",{
                        cours,
                        matieres
                    })
                }
            })
            
        }
    })
})

router.post("/creer_emploi", adminMiddleware, function(request,response){

    sql.query("insert into emploi (id_classe,annee) values('"+request.body.id+"','"+request.body.annee+"')",function(err,emp){
        if(err) throw err;
        else
        {
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.l8+"','l8')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.l9+"','l9')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.l10+"','l10')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.l11+"','l11')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.l12+"','l12')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.l13+"','l13')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.l14+"','l14')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.l15+"','l15')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.l16+"','l16')");
        
        
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.m8+"','m8')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.m9+"','m9')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.m10+"','m10')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.m11+"','m11')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.m12+"','m12')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.m13+"','m13')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.m14+"','m14')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.m15+"','m15')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.m16+"','m16')");
        
        
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.me8+"','me8')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.me9+"','me9')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.me10+"','me10')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.me11+"','me11')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.me12+"','me12')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.me13+"','me13')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.me14+"','me14')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.me15+"','me15')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.me16+"','me16')");
        
        
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.j8+"','j8')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.j9+"','j9')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.j10+"','j10')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.j11+"','j11')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.j12+"','j12')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.j13+"','j13')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.j14+"','j14')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.j15+"','j15')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.j16+"','j16')");
        
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.v8+"','v8')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.v9+"','v9')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.v10+"','v10')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.v11+"','v11')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.v12+"','v12')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.v13+"','v13')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.v14+"','v14')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.v15+"','v15')");
            sql.query("insert into cours (id_emploi, matiere,heure) values ('"+emp.insertId+"','"+request.body.v16+"','v16')");
        
            request.session.message = "l'emploi du temps a été créé";
            response.redirect("/emploi");
        }
    })

      
})

router.post("/modifier_emploi", adminMiddleware, function(request,response){
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.l8+"' where c.heure = 'l8' and e.id = '"+request.body.id+"' and c.id_emploi = e.id ");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.l9+"' where c.heure = 'l9' and e.id = '"+request.body.id+"' and c.id_emploi = e.id ");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.l10+"' where c.heure = 'l10' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.l11+"' where c.heure = 'l11' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.l12+"' where c.heure = 'l12' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.l13+"' where c.heure = 'l13' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.l14+"' where c.heure = 'l14' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.l15+"' where c.heure = 'l15' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.l16+"' where c.heure = 'l16' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");

    sql.query("update cours c, emploi e set c.matiere = '"+request.body.m8+"' where c.heure = 'm8' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.m9+"' where c.heure = 'm9' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.m10+"' where c.heure = 'm10' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.m11+"' where c.heure = 'm11' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.m12+"' where c.heure = 'm12' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.m13+"' where c.heure = 'm13' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.m14+"' where c.heure = 'm14' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.m15+"' where c.heure = 'm15' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.m16+"' where c.heure = 'm16' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");

    sql.query("update cours c, emploi e set c.matiere = '"+request.body.me8+"' where c.heure = 'me8' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.me9+"' where c.heure = 'me9' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.me10+"' where c.heure = 'me10' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.me11+"' where c.heure = 'me11' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.me12+"' where c.heure = 'me12' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.me13+"' where c.heure = 'me13' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.me14+"' where c.heure = 'me14' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.me15+"' where c.heure = 'me15' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.me16+"' where c.heure = 'me16' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");

    sql.query("update cours c, emploi e set c.matiere = '"+request.body.j8+"' where c.heure = 'j8' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.j9+"' where c.heure = 'j9' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.j10+"' where c.heure = 'j10' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.j11+"' where c.heure = 'j11' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.j12+"' where c.heure = 'j12' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.j13+"' where c.heure = 'j13' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.j14+"' where c.heure = 'j14' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.j15+"' where c.heure = 'j15' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.j16+"' where c.heure = 'j16' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");

    sql.query("update cours c, emploi e set c.matiere = '"+request.body.v8+"' where c.heure = 'v8' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.v9+"' where c.heure = 'v9' and e.id  = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.v10+"' where c.heure = 'v10' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.v11+"' where c.heure = 'v11' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.v12+"' where c.heure = 'v12' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.v13+"' where c.heure = 'v13' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.v14+"' where c.heure = 'v14' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.v15+"' where c.heure = 'v15' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");
    sql.query("update cours c, emploi e set c.matiere = '"+request.body.v16+"' where c.heure = 'v16' and e.id = '"+request.body.id+"' and c.id_emploi = e.id");

    request.session.message = "l'emploi du temps a été modifié";
    response.redirect("/emploi");

})

module.exports = router;