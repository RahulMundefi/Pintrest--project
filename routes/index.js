var express = require('express');
var router = express.Router();
const userModel =require("./users");
const postModel = require("./post");
const passport =require("passport"); 
const upload = require("./multer")

const localStrategy = require("passport-local"); // login hota hai 
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */ 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); 

router.get('/login', function(req, res, next) {
  res.render("login",{error: req.flash('error')});   //galat credential dalnay par error
}); 

router.get('/feed', function(req, res, next) {
  res.render('feed');
});  

router.post("/upload", isLoggedIn,upload.single("file"), async function(req,res,next){
  if(!req.file)
  {return res.status(404).send("no files were given");}
  const user = await userModel.findOne({ username: req.session.passport.user}); 

 const post = await postModel.create({
    image:req.file.filename,
    imageText:req.body.filecaption,
    user:user._id
  }) 
   user.posts.push(post._id);
   await user.save();
  res.redirect("/profile");
})

router.get("/profile",isLoggedIn, async function(req,res,next){
  const user = await userModel.findOne({
    username :req.session.passport.user  //jab login hotay hain ismai username rehta hai save tou ussay retrive 
  })
  .populate("posts");
  res.render("profile" ,{user}) ;

});


router.post("/register",function(req,res){
 const {username,email,fullname} =req.body;
 const userData= new userModel({username,email,fullname});

 userModel.register(userData,req.body.password)
 .then(function(registerduser){
  passport.authenticate("local")(req,res,function(){
    res.redirect("/profile");
  })
 })
})

router.post("/login", passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",                       //login 
  failureFlash : true              //agar galat login kiya tou true hojaeyga
}) , function( req,res){
});


router.get("/logout",function(req,res){
  req.logout(function(err){           //logout 
    if(err){return next(err);}
    res.redirect('/');
  });
}) 

function isLoggedIn(req,res,next){
  if(req.isAuthenticated())return next();
  res.redirect("/login");
}

module.exports = router;
