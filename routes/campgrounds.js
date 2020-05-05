var express 	= require("express");
var router 		= express.Router();
var Campground  = require("../models/campground");
var middleware  = require("../middleware/index.js");

router.get("/", function(req,res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req,res){
	//get data from form and add to campground
	var CurName = req.body.name;
	var CurImage = req.body.image;
	var CurDesc = req.body.description;
	var CurPrice = req.body.price;

	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: CurName,price: CurPrice, image: CurImage, description: CurDesc, author: author}
	
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
});

router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});


//edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	//match user id with author id to let him delete//
	//check login or not
			Campground.findById(req.params.id, function(err, foundCampground){
				res.render("campgrounds/edit", {campground: foundCampground});
			});
});

//update
router.put("/:id", middleware.checkCampgroundOwnership,function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//delete campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds");
		}
	})
});

module.exports = router;