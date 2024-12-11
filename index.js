var express = require("express");
var app = express()
app.use(express.static("public"));
app.use(express.static("uploads"));
app.set("view engine","ejs");
app.set("views","./views");
const session = require("express-session");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(session({
    secret: "ibrahima",
    saveUninitialized: false,
    resave: false
}));
const nocache = require("nocache");
app.use(nocache());
const sql = require("./Database/db.js");
app.use(express.urlencoded({extended: 'true'}))
app.use(express.json())

app.listen(3000);
console.log("server started");

const router = (global.router = (express.Router()));
app.use("/login-controller", require("./controllers/login-controller"));
app.use("/classe-controller", require("./controllers/classe-controller"));
app.use("/utilisateur-controller", require("./controllers/utilisateur-controller"));
app.use("/matiere-controller", require("./controllers/matiere-controller"));
app.use("/evaluation-controller", require("./controllers/evaluation-controller"));

app.use(router)



app.get("/",function(request,response)
{
    response.render("homepage",{
        role : request.session.role
    });
});


app.get("/homepage",function(request,response)
{
  if(request.session.connected== true)
    response.render("homepage",{
        role : request.session.role
    });
    else
    response.render("homepage")
});

app.get("/loggedIn",function(request,response){
  if(request.session.connected == true){
      response.render("homepage",{
          role : request.session.role
      })
  }else{
      response.redirect("/homepage");
  }
})


app.get("/deconnecter",function(request,response){
    request.session.connected = null;
    request.session.role = null;
    response.render("homepage");
})

app.get('/check_email', (req, res) => {
    res.render('check_email'); 
  });
  
  
  app.get('/api/check_email', (req, res) => {
    
    const sql1 = "select email from user"; 
  
    sql.query(sql1, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      }else{
        res.json(results);
      }
    })
})

app.get('/check_classe', (req, res) => {
  res.render('check_classe'); // exemple de seuil par défaut
});

// API pour verifier doublon de classe
app.get('/api/check_classe', (req, res) => {
  
  const sql1 = "select nom, niveau from classe"; 

  sql.query(sql1, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }else{
      res.json(results);
    }
  })
})


app.get('/check_matiere', (req, res) => {
  res.render('check_matiere'); 
});
// API pour verifier doublon de matière
app.get('/api/check_matiere', (req, res) => {
  
  const sql1 = "select * from matiere"; 

  sql.query(sql1, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }else{
      res.json(results);
    }
  })
})
