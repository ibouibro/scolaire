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

router.get("/eleves", adminMiddleware, function(request,response){
    var el = "élève";
sql.query("select u.*, c.nom as classe, c.niveau from user u, classe_eleve e, classe c where role = '"+el+"' and u.id = e.id_eleve and c.id = e.id_classe  and e.annee = '"+request.session.annee+"' ",function(err,res_e){
    if(err) throw err;
    else{
        sql.query("select * from document",function(err1,res_d){
    if(err1) throw err1;
    else
    {
        var p = "parent";
        sql.query("select * from user where role = '"+p+"'",function(err2,res_p){
            if(err2) throw err2;
            else
            {
                var message = request.session.message;
                request.session.message = null;
                return response.render("utilisateurs/eleves",{
                    eleves : res_e,
                    document : res_d,
                    role : request.session.role,
                    message : message,
                    parents : res_p
                   })
            }
            
                })
    }
    
        })
    }
})
})

router.get("/one_doc",adminMiddleware,function(request,response){
    sql.query("select path from document where id ='"+request.query.id+"' ",function(err,res){
        if(err) throw err
        else
        return response.render("utilisateurs/one_doc",{
           document : res[0].path,
           role : request.session.role
        })
    })
})


router.get("/autres_utilisateurs",adminMiddleware,function(request,response){
    sql.query("select * from user where role !='élève' ",function(err,res){
        if(err) throw err
        else
        return response.render("utilisateurs/autres_utilisateurs",{
           users : res,
           role : request.session.role
        })
    })
})

router.get("/accepter_admission",adminMiddleware,function(request,response){
    var admis = "oui";
    sql.query("update user set admis = '"+admis+"' where id ='"+request.query.id+"' ",function(err,res){
        if(err) throw err
        else
        {
            request.session.message = "l\'admission a été acceptée";
            response.redirect("/eleves")
        }
       
    })
})

router.get("/refuser_admission",adminMiddleware,function(request,response){
    var admis = "non";
    sql.query("update user set admis = '"+admis+"' where id ='"+request.query.id+"' ",function(err,res){
        if(err) throw err
        else
        {
            request.session.message = "l\'admission a été refusée";
            response.redirect("/eleves")
        }
       
    })
})

module.exports = router;