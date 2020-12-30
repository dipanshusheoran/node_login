if(process.env.NODE_ENV !=="production"){
   require('dotenv').config()
}
var express = require('express');
var bcrypt = require('bcrypt');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
var app = express();
const initializePassport = require('./passport-config')

initializePassport(passport,
   email=>users.find(user=>user.email==email),
   id=>users.find(user=>user.id==id)
)

const users = []

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended : false}))
app.use(flash())
app.use(session({
   secret : process.env.SECRET_SESSION,
   resave : false,
   saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', function(req, res){
   res.render("index",{
      name : 'Kylie',
   });
});

app.get('/login',(req,res)=>{
   res.render('login')
})

app.get('/register',(req,res)=>{
   res.render('register')
})
app.post('/register',async (req,res)=>{
   try{
      const hashedPassword =await bcrypt.hash(req.body.password,10)
      users.push({
         id : Date.now().toString(),
         name : req.body.name,
         email: req.body.email,
         password:hashedPassword
   })
   res.redirect('/login')
   }catch{
      res.redirect('/register')
   }
   console.log(users)
})

app.post('/login',passport.authenticate('local',{
   successRedirect:'/',
   failureRedirect:'/login',
   failureFlash:true
})
)

app.listen(3000,()=>{
   console.log("Connected to server")
});