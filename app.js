const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    moment = require("moment"),
    helmet = require("helmet"),
    methodOverride = require('method-override'),
    passport = require("passport"),
    passportLocal = require("passport-local"),
    flash = require("connect-flash"),
    // postModel = require("./models/posts"),
    // commentModel = require("./models/comments"),
    User = require("./models/user");

const blogRoute = require("./routes/blog");
const commentRoute = require("./routes/comments");
const indexRoute = require("./routes/index");
mongoose.connect('mongodb://localhost:27017/aaa', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
});

app.set("view engine", "ejs");

// middleware
app.use(bodyParser.urlencoded({
    extended: true
}))
// parse application/json
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(helmet());
app.use(methodOverride('_method'));
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal({
        usernameField: 'username',
        passwordField: "password"
    },
    User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use(function (req, res, next) {
    res.locals.moment = moment;
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

// routes
app.use("/blogs", blogRoute);
app.use("/blogs/:id/comment", commentRoute);
app.use("/", indexRoute);


// listen to port 3000
app.listen(3000 || process.env.PORT, process.env.IP, () => {
    console.log("the server is running");
})