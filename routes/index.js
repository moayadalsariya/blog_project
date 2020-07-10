const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const postModel = require("../models/posts");
const commentModel = require("../models/comments");
const ObjectId = require("mongodb").ObjectID;

const middleware = require("../middleware/index");
router.get("/", (req, res) => {
    res.render("landing");
})

router.get("/login", (req, res) => {
    res.render("login");
})
router.get("/signup", (req, res) => {
    res.render("signup");
})
//handling user sign up
router.post("/signup", function (req, res, next) {
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        img: req.body.img
    })
    User.register(newUser, req.body.password, (err, founduser) => {
        if (err) {
            console.log(err)
            req.flash("error", err.message);
            res.redirect("/signup");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to the new user " + founduser.username);
            res.redirect("/blogs");
        })
    })
});
router.get("/login", (req, res) => {
    res.render("login");
})
router.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs", // this's called middleware
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "You have successful login"
}))

router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "You have successful logout");
    res.redirect("/blogs");
})
//

router.get("/profile/:id", middleware.isLoggedIn, (req, res) => {
    postModel.find({
        author: ObjectId(req.params.id)
    }, function (err, foundData) {
        if (err) {
            console.log(err);
        } else {
            data = foundData;
        }
    })
    commentModel.find({
        author: ObjectId(req.params.id)
    }, function (err, foundComments) {
        if (err) {
            console.log(err);
        } else {
            data.comments = foundComments;
            res.render("profile", {
                data: data
            })
        }
    })


})

module.exports = router;