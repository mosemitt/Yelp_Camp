const dotenv = require("dotenv").config();

const express       = require("express"),
      app           = express(),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
	  passport      = require("passport"),
	  LocalStrategy = require("passport-local"),
	  flash          = require("connect-flash"),
      Campground    = require("./models/campground"),
	  methodOverride = require("method-override"),
	  Comment       = require("./models/comment"),
	  User          = require("./models/user");
	  // seeDB         = require("./seeds");  

// requiring routes
const commentRoutes     = require("./routes/comments"),
	  campgroundRoutes = require("./routes/campgrounds"),
	  indexRoutes       = require("./routes/index");

var url = process.env.DATABASEURL;
mongoose.connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false	
}).then(() => {
	console.log("Connected to db!");
}).catch(err => {
	console.log("ERROR:", err);
});

//            WHEN WORKING IN PRODOCTION STAGE
// mongoose.connect('mongodb://localhost:27017/yelp_camp_v11Deploying', {
// 	useNewUrlParser: true,
// 	useFindAndModify: false
// });

//        PUBLIC DATABASE
// mongoose.connect("mongodb+srv://MosDev:DATABASEURL@cluster0-leeqi.mongodb.net/test?retryWrites=true&w=majority", {
// 	useNewUrlParser: true,
// 	useCreateIndex: true
// }).then(() => {
// 	console.log("Connected to db!");
// }).catch(err => {
// 	console.log("ERROR:", err);
// });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
// seeDB(); //seed the DB

// PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret: "It's not a secter",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
   if(err){
	   console.log("YOU HAVE LISTEN ERROR");
   } else {
	   console.log("The Yelp Camp Server has started at port " + PORT);
   }
});