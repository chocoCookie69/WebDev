var express 		= require("express");
var app 			= express();
var bodyParser  	= require("body-parser");
var mongoose 		= require("mongoose");
var Campground  	= require("./models/campground");
var seedDB			= require("./seeds");
var Comment     	= require("./models/comment");
var LocalStrategy 	= require("passport-local");
var User 			= require("./models/user");
var passport 		= require("passport");
var methodOverride  = require("method-override");
//requiring routes
var commentRoutes 	= require("./routes/comments");
var campgroundRoutes= require("./routes/campgrounds");
var indexRoutes 	= require("./routes/index");
var flash 			= require("connect-flash");

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelp_camp_v6", { useNewUrlParser: true }) ;
app.use(express.static(__dirname + "/public"));

app.use(flash());
//seedDB();

////////////////////////	  PASSPORT CONFIGURATION		//////////////////////////
app.use(require("express-session")({
	secret: "Dog",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 
app.use(function(req, res, next){
	res.locals.currentUser  = req.user;
	res.locals.success 		= req.flash("success"); 
	res.locals.error 		= req.flash("error");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, '127.0.0.1' , function(){
	console.log("The server has started!");
});