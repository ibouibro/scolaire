const sql = require("./../Database/db.js");


const router = global.router;
const bcrypt = require("bcrypt");
const { request } = require("express");
const nodemailer = require('nodemailer');
const nocache = require("nocache");
router.use(nocache());
const adminMiddleware = (req, res, next) =>{
    if(req.session.connected == null || req.session.role != "administrateur")
    {

     res.redirect("/homepage");
        
    }else{

    next();
    }
}



router.get("/ajouter_utilisateur_form",adminMiddleware,function(request,response)
{
    sql.query("select * from classe", function(err,res){
        if(err) throw err;
        else
        sql.query("select * from matiere", function(err,res1){
          if(err) throw err;
          else{
            var message = request.session.message;
            request.session.message = null;
            response.render("ajouter_utilisateur_form",
              { role : request.session.role,
                  classes : res,
                  matieres : res1,
                  message : message
               }
           );
          }
          
      })
    })
   
});

router.post("/register", adminMiddleware, function(request,response){

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   

    // Create a transporter object using the SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // For Gmail, use 'gmail' service
    auth: {
        user: 'ibouibn28@gmail.com', // Your Gmail address
        pass: 'yqds dxji rsrt mofm'   // Your Gmail password or app password (if 2FA enabled)
    }
});
var parent ="";
var admis = "";
const charactersLength = characters.length;
if(request.body.role == "élève"){

    sql.query("select * from user where email = '"+request.body.email_parent+"'",function(err,res){
        if(err) throw err;
        else{
            if(res.length > 0)
            {
                parent=res[0].id;
                admis ="oui";
                let mdp = '';


for (let i = 0; i < 6; i++) {
    mdp += characters.charAt(Math.floor(Math.random() * charactersLength));
}
mpd = "passer";
// Set email options
const mailOptions1 = {
    from: 'ibouibn28@gmail.com',       // Sender address
    to: request.body.email,        // List of recipients
    subject: 'Informations de connexion',      // Subject line
    text: 'APPLICATION DE GESTION SCOLAIRE \n Bonjour '+request.body.prenom+' votre  mot de passe est : '+mdp, // Plain text body
    // You can also add an HTML body:
    // html: '<p>This is a <b>test</b> email sent from Node.js!</p>'
};

// Send the email
transporter.sendMail(mailOptions1, (error, info) => {
    if (error) {
         console.log(error);
    }
   
});

bcrypt.hash(mdp, 10, function(err, hash1) {
    sql.query("insert into user (prenom,email,password,role,nom,tel,admis,parent) values ('"+request.body.prenom+"','"+request.body.email+"','"+hash1+"','"+request.body.role+"','"+request.body.nom+"','"+request.body.tel+"','"+admis+"','"+parent+"')",(error,resu) => {
        if(error) throw error;
        
        else{
            const currentYear = new Date().getFullYear();
            const nextYear =  parseInt(currentYear)+1;
            var an = currentYear+" - "+nextYear;
           sql.query("insert into classe_eleve (id_eleve, id_classe,annee) values ('"+resu.insertId+"','"+request.body.classe+"','"+an+"')");
         response.render("ajouter_utilisateur_form",{
            role : request.session.role,
            message : "l'utilisateur a été ajouté avec succès"
         })
        }
    
    
    })
   });

            }else{
                let mdp = '';


                for (let i = 0; i < 6; i++) {
                    mdp += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                // Set email options
                mdp = 'passer';
                const mailOptions = {
                    from: 'ibouibn28@gmail.com',       // Sender address
                    to: request.body.email_parent,        // List of recipients
                    subject: 'Informations de connexion',      // Subject line
                    text: 'APPLICATION DE GESTION SCOLAIRE \n Bonjour '+request.body.prenom_parent+'votre  mot de passe est : '+mdp, // Plain text body
                    // You can also add an HTML body:
                    // html: '<p>This is a <b>test</b> email sent from Node.js!</p>'
                };
                
                // Send the email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                      console.log(error);
                    }
                   
                });
                
                    bcrypt.hash(mdp, 10, function(err, hash) {
                        // Store hash in your password DB.
                  
                  var role = "parent";
                  
                    sql.query("insert into user (prenom,email,password,role,nom,tel) values ('"+request.body.prenom_parent+"','"+request.body.email_parent+"','"+hash+"','"+role+"','"+request.body.nom_parent+"','"+request.body.tel_parent+"')",(error,resultu) => {
                        if(error) throw error;
                        
                        else{
                           
                         parent = resultu.insertId;
                         admis = "oui";
                        }
                
                
                    })
                   
                
                   
                
                   
                    
                });
            }
        }
    })

   }
   else{

let mdp = '';


for (let i = 0; i < 6; i++) {
    mdp += characters.charAt(Math.floor(Math.random() * charactersLength));
}
mdp = "passer";
// Set email options
const mailOptions1 = {
    from: 'ibouibn28@gmail.com',       // Sender address
    to: request.body.email,        // List of recipients
    subject: 'Informations de connexion',      // Subject line
    text: 'APPLICATION DE GESTION SCOLAIRE \n Bonjour '+request.body.prenom+' votre  mot de passe est : '+mdp, // Plain text body
    // You can also add an HTML body:
    // html: '<p>This is a <b>test</b> email sent from Node.js!</p>'
};

// Send the email
transporter.sendMail(mailOptions1, (error, info) => {
    if (error) {
         console.log(error);
    }
   
});

parent = "";
admis = "";
bcrypt.hash(mdp, 10, function(err, hash1) {
    sql.query("insert into user (prenom,email,password,role,nom,tel,admis,parent) values ('"+request.body.prenom+"','"+request.body.email+"','"+hash1+"','"+request.body.role+"','"+request.body.nom+"','"+request.body.tel+"','"+admis+"','"+parent+"')",(error,res_en) => {
        if(error) throw error;
        
        else{
          if(request.body.role == "enseignant"){
            for(var i=0;i<request.body.matiere.length;i++)
            {
              
              sql.query("insert into matiere_user (id_user,id_matiere) values('"+res_en.insertId+"','"+request.body.matiere[i]+"')",function(err,r){
                if(err) throw err;
              });
            }
           
          
          }

          request.session.message = "l'utilisateur a été ajouté avec succès";
         response.redirect("/ajouter_utilisateur_form")
        }
    
    
    })
   });



   }

})


router.post("/login",function(request,response){
    sql.query("select * from user where email='"+request.body.email+"'", (error,result) => {
        if(error){
            console.log(error)
           
        
        }else{
        if(result.length==0){
            return response.render('login', {
                error: 'incorrect username'
            })
        }else{
        
            bcrypt.compare(request.body.password, result[0].password, (error, res) => {
                if (error) {
                    console.error('Error: ', error);
                } else {
                    if(res==true){
                        // true or false
                        request.session.connected=true;
                        request.session.role=result[0].role;
                        request.session.nom=result[0].prenom;
                        request.session.num=result[0].id;

                        sql.query("select * from annee",function(err,an){
                          if(err) throw err;
                          else{
                            request.session.annee=an[0].val
                            return response.redirect("/loggedIn");
                          }
                          
                        })

                       
                       
                }else
            {
                return response.render('login', {
                    error: 'incorrect password'
                })
            }}
            });
           
        }
        }
            })
})

router.get("/login_form",function(request,response){
    if(request.session.connected  == null)
    response.render("login");
    else
    response.redirect("/homepage");
})

router.get("/preinscription_form",function(request,response){

    
    
    sql.query("select * from classe",function(err,res){
        if(err) throw err;
        else
        response.render("preinscription_form",{
    classe : res,
    role : request.session.role
    });
    })
    
})


const fs = require('fs');
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });

  router.post("/ajouter_preinscription", upload.fields([
    { name: 'doc', maxCount: 10 }, // pour plusieurs fichiers ayant le même champ 'files'
    { name: 'photo_e', maxCount: 1 },
    { name: 'photo_p', maxCount: 1 }
  ]),function(request,response)
{

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   
       // Create a transporter object using the SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // For Gmail, use 'gmail' service
    auth: {
        user: 'ibouibn28@gmail.com', // Your Gmail address
        pass: 'yqds dxji rsrt mofm'   // Your Gmail password or app password (if 2FA enabled)
    }
});


const charactersLength = characters.length;

sql.query("select * from user where email = '"+request.body.email_parent+"'",function(err,res){
    if(err) throw err;
    else{
        if(res.length > 0)
        {
            var admis = "en attente";
            var parent=res[0].id;

            if (request.files['photo_e']) {
                request.files['photo_e'].forEach(file => {
                  var p = "/"+file.path.replaceAll("\\","/").split("/")[1];
                  bcrypt.hash(request.body.password, 10, function(err, hash1) {
                    var role1 = "élève";
                    sql.query("insert into user (prenom,email,password,role,nom,tel,admis,parent,path) values ('"+request.body.prenom+"','"+request.body.email+"','"+hash1+"','"+role1+"','"+request.body.nom+"','"+request.body.tel+"','"+admis+"','"+parent+"','"+p+"')",(error,result_u) => {
                        if(error) throw error;
                        
                        else{
                            const id_user = result_u.insertId;
                
                            const currentYear = new Date().getFullYear();
                            const nextYear = parseInt(currentYear)+1;
                            var an = currentYear+" - "+nextYear;
                           sql.query("insert into classe_eleve (id_eleve, id_classe,annee) values ('"+id_user+"','"+request.body.classe+"','"+an+"')");
                        
                
                            const filesRecords = [];
                         
                            if (request.files['doc']) {
                                request.files['doc'].forEach(file => {
                                  filesRecords.push([id_user, "/"+file.path.replaceAll("\\","/").split("/")[1]]);
                                });
                              }
                
                               // Insertion dans la base de données MySQL
                        const insertFiles = () => {
                            return new Promise((resolve, reject) => {
                              if (filesRecords.length > 0) {
                                sql.query('INSERT INTO document (id_user, path) VALUES ?', [filesRecords], (err) => {
                                  if (err) reject(err);
                                  else resolve();
                                });
                              } else {
                                resolve(); // Si pas de fichiers pour cette table
                              }
                            });
                          };
                
                          Promise.all([insertFiles()])
                          .then(() => {
                            sql.query("select * from classe",function(err_c,res_c){
                                response.render("preinscription_form",{
                                    message : "la préinscription a été créée avec succès",
                                    classe : res_c,
                                    role : request.session.role
                                  })
                            })
                            
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                
                        }
                    
                    
                    })
                   });

                });
              }

         

        }else{
            let mdp = '';


            for (let i = 0; i < 6; i++) {
                mdp += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            mdp = "passer";
            // Set email options
            const mailOptions = {
                from: 'ibouibn28@gmail.com',       // Sender address
                to: request.body.email_parent,        // List of recipients
                subject: 'Informations de connexion',      // Subject line
                text: 'APPLICATION DE GESTION SCOLAIRE \n Bonjour '+request.body.prenom_parent+'votre  mot de passe est : '+mdp, // Plain text body
                // You can also add an HTML body:
                // html: '<p>This is a <b>test</b> email sent from Node.js!</p>'
            };
            
            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                     console.log(error);
                }
               
            });
            
            if (request.files['photo_p']) {
                request.files['photo_p'].forEach(file => {
                  var p = "/"+file.path.replaceAll("\\","/").split("/")[1];
                  bcrypt.hash(mdp, 10, function(err, hash) {
                    // Store hash in your password DB.
              
              var role = "parent";
                sql.query("insert into user (prenom,email,password,role,nom,tel,path) values ('"+request.body.prenom_parent+"','"+request.body.email_parent+"','"+hash+"','"+role+"','"+request.body.nom_parent+"','"+request.body.tel_parent+"','"+p+"')",(error,resultu) => {
                    if(error) throw error;
                    
                    else{

                        var admis = "en attente";
                       
                     var parent = resultu.insertId;
                     if (request.files['photo_e']) {
                        request.files['photo_e'].forEach(file => {
                          var p1= "/"+file.path.replaceAll("\\","/").split("/")[1];
                          bcrypt.hash(request.body.password, 10, function(err, hash1) {
                            var role1 = "élève";
                            sql.query("insert into user (prenom,email,password,role,nom,tel,admis,parent,path) values ('"+request.body.prenom+"','"+request.body.email+"','"+hash1+"','"+role1+"','"+request.body.nom+"','"+request.body.tel+"','"+admis+"','"+parent+"','"+p1+"')",(error,result_u) => {
                                if(error) throw error;
                                
                                else{
                                    const id_user = result_u.insertId;
                        
                                    const currentYear = new Date().getFullYear();
                                    const nextYear = parseInt(currentYear)+1;
                                    var an = currentYear+" - "+nextYear;
                                   sql.query("insert into classe_eleve (id_eleve, id_classe,annee) values ('"+id_user+"','"+request.body.classe+"','"+an+"')");
                                
                        
                                    const filesRecords = [];
                                 
                                    if (request.files['doc']) {
                                        request.files['doc'].forEach(file => {
                                          filesRecords.push([id_user, "/"+file.path.replaceAll("\\","/").split("/")[1]]);
                                        });
                                      }
                        
                                       // Insertion dans la base de données MySQL
                                const insertFiles = () => {
                                    return new Promise((resolve, reject) => {
                                      if (filesRecords.length > 0) {
                                        sql.query('INSERT INTO document (id_user, path) VALUES ?', [filesRecords], (err) => {
                                          if (err) reject(err);
                                          else resolve();
                                        });
                                      } else {
                                        resolve(); // Si pas de fichiers pour cette table
                                      }
                                    });
                                  };
                        
                                  Promise.all([insertFiles()])
                                  .then(() => {
                                    sql.query("select * from classe",function(err_c,res_c){
                                        response.render("preinscription_form",{
                                            message : "la préinscription a été créée avec succès",
                                            classe : res_c
                                          })
                                    })
                                    
                                  })
                                  .catch((error) => {
                                    console.log(error);
                                  });
                        
                                }
                            
                            
                            })
                           });
                        });
                      }
        

                     
                     
                    }
            
            
                })
               
            
               
            
               
                
            });
                });
              }

               
        }
    }
})


})

module.exports = router;