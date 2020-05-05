var express 	= require("express");
var router 		= express.Router();
var passport 	= require("passport");
var User 		= require("../models/user");

//root
router.get("/",function(req,res){
	res.render("landing.ejs");
});
//register form
router.get("/register", function(req, res){
	res.render("register");
});
//logic for register
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Posts " + user.username);
			res.redirect("/campgrounds");
		});
	});
});
//login form
router.get("/login", function(req, res){
	res.render("login");
});
//handling login
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "./campgrounds",
		failureRedirect: "login"
	}), function(req, res){
});
//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!")
	res.redirect("/campgrounds");
})

module.exports = router;