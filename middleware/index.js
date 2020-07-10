const postModel = require("../models/posts");
const commentModel = require("../models/comments");

let obj = {
    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error","Please login first !!");
        res.redirect("/login");
    },
    isUserOwnPost: function (req, res, next) {
        // if user logged in
        if (req.isAuthenticated()) {
            // does user own the post ?
            postModel.findById(req.params.id, (err, foundPost) => {
                if (err) {
                    console.log(err);
                    res.redirect("/blogs");
                } else {
                    if (JSON.stringify(req.user._id) === JSON.stringify(foundPost.author._id)) {
                        console.log("You own this posts");
                        next();
                        return;
                    } else {
                        console.log("You don't own this post");
                        req.flash("error","You don't own this post");
                        res.redirect("/blogs");
                    }
                }
            })
        } else {
            req.flash("error","Please login first !!");
            // if not redirect login
            res.redirect("/login");
        }
    },
    isUserOwnComment: function (req, res, next) {
        // if user logged in
        if (req.isAuthenticated()) {
            // does user own the post ?
            commentModel.findById(req.params.comment_id, (err, foundComment) => {
                if (err) {
                    console.log(err);
                    res.redirect("/blogs");
                } else {
                    if (JSON.stringify(req.user._id) === JSON.stringify(foundComment.author._id)) {
                        console.log("You own this comment");
                        next();
                        return;
                    } else {
                        console.log("You don't own this comment");
                        req.flash("error","You don't own this comment");
                        res.redirect("back");
                    }
                }
            })
        } else {
            // if not redirect login
            req.flash("error","Please login first !!");
            res.redirect("/login");
        }



    }
}

module.exports = obj;