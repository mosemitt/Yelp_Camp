const Campground = require("../models/campground");
const Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if(err) {
				req.flash("error", "Campground not found");
			res.redirect("back");
			} else {
			// 	  does user own ths campground?
				if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
	    });
	} else {
		req.flash("error", "You need to be logged in do to that");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err) {
		res.redirect("back");
		} else {
		// 	  does user own ths comment?
			if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
				next();
			} else {
				req.flash("error", "You don't have permisson to do that");
				res.redirect("back");
			}
		}
		});
	} else {
		req.flash("error", "You need to be logged in do to that");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in do to that");
	res.redirect("/login");
};


module.exports = middlewareObj;
	
