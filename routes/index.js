var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User     = require("../models/user");
var Campground = require("../models/campground");



// root route
router.get("/", (req, res) => {
	res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

// handle sign up logic
router.post("/register", (req, res) => {
	var userName = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		avatar: req.body.avatar
	});
	
	if(req.body.adminCode === process.env.ADMIN_CODE) {
		userName.isAdmin = true;
	}
	
	User.register(userName, req.body.password, (err, user) => {
		if(err){
		console.log(err);
		return res.render("register", {error: err.message});
		} 
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});
// handling login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),(req, res) => {	
});

// logout route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

// USER PROFILE
router.get("/users/:id", (req, res) => {
	User.findById(req.params.id, function(err,foundUser){
		if(err){
			req.flash("error", "Somthing Went Wrong");
		} else {
			Campground.find().where("author.id").equals(foundUser._id).exec(function (err, campgrounds){
			if(err){
			req.flash("error", "Somthing Went Wrong");
		    } else {
			    res.render("users/show", {user: foundUser, campgrounds: campgrounds});
			}	
			});
		}
	});
});


module.exports = router;